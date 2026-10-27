// Decides how to handle one Instagram comment and drafts the reply.
// Uses Claude when ANTHROPIC_API_KEY is set; otherwise the store's existing Gemini key (GOOGLE_AI_API_KEY).
import Anthropic from 'npm:@anthropic-ai/sdk@1.3.0';
import { REPLY_RULES } from './knowledge.ts';

const MODEL = Deno.env.get('IG_AGENT_MODEL') || 'claude-opus-5-5';
// Gemini model ids get retired or overloaded; on 404/busy the agent falls back to other available Flash models
let geminiModel = Deno.env.get('IG_AGENT_GEMINI_MODEL') || 'gemini-3.8-flash';

export const CATEGORIES = [
  'technical_question',
  'price_question',
  'location_contact',
  'praise',
  'friend_tag',
  'complaint',
  'spam',
  'other',
] as const;

export interface AgentDecision {
  category: (typeof CATEGORIES)[number];
  action: 'reply' | 'review' | 'ignore';
  reply: string;
  reason: string;
}

export interface CommentContext {
  username?: string | null;
  text: string;
  caption?: string | null;
  parentText?: string | null;
}

const schema = {
  type: 'object',
  properties: {
    category: { type: 'string', enum: [...CATEGORIES] },
    action: { type: 'string', enum: ['reply', 'review', 'ignore'] },
    reply: { type: 'string', description: 'The reply text to post (empty when action is ignore).' },
    reason: { type: 'string', description: 'One short sentence explaining the decision, for the admin.' },
  },
  required: ['category', 'action', 'reply', 'reason'],
  additionalProperties: false,
};

let client: Anthropic | null = null;

export async function decide(ctx: CommentContext, knowledge: string, extraRules: string): Promise<AgentDecision> {
  const system = `${REPLY_RULES}\n\n<knowledge>\n${knowledge}\n</knowledge>${extraRules.trim() ? `\n\nقواعد إضافية من صاحب الصفحة:\n${extraRules}` : ''}`;
  const parts = [
    ctx.caption ? `<post_caption>\n${ctx.caption}\n</post_caption>` : '',
    ctx.parentText ? `<parent_comment>\n${ctx.parentText}\n</parent_comment>` : '',
    `<comment username="${(ctx.username ?? '').replace(/"/g, '')}">\n${ctx.text}\n</comment>`,
  ].filter(Boolean);

  const d = Deno.env.get('ANTHROPIC_API_KEY')
    ? await decideWithClaude(system, parts.join('\n\n'))
    : await decideWithGemini(system, parts.join('\n\n'));
  if (d.action !== 'ignore' && !d.reply.trim()) d.action = 'review';
  return d;
}

async function decideWithClaude(system: string, user: string): Promise<AgentDecision> {
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
    // knowledge + rules are identical across comments, so cache them
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  });

  if (response.stop_reason === 'refusal') {
    return { category: 'other', action: 'review', reply: '', reason: 'The model declined this comment; needs a human.' };
  }
  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error(`No text in model response (stop_reason=${response.stop_reason})`);
  return JSON.parse(text.text) as AgentDecision;
}

async function listGeminiFlashModels(key: string): Promise<string[]> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${key}`);
  const body = await res.json();
  if (!res.ok) throw new Error(`Gemini model list error ${res.status}: ${JSON.stringify(body.error ?? body)}`);
  const names: string[] = (body.models ?? [])
    .filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m: { name: string }) => m.name.replace(/^models\//, ''))
    .filter((n: string) => /^gemini-[\d.]+-flash/.test(n) && !/(image|tts|audio|live|thinking|exp|preview)/.test(n));
  // newest Flash-Lite first (fast when the full model is slow or busy), then the other Flash models newest first
  names.sort((a, b) => Number(b.includes('lite')) - Number(a.includes('lite')) || parseFloat(b.slice(7)) - parseFloat(a.slice(7)) || a.length - b.length);
  return names;
}

function callGemini(model: string, key: string, system: string, user: string) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(25_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING', enum: [...CATEGORIES] },
            action: { type: 'STRING', enum: ['reply', 'review', 'ignore'] },
            reply: { type: 'STRING' },
            reason: { type: 'STRING' },
          },
          required: ['category', 'action', 'reply', 'reason'],
        },
      },
    }),
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retry busy/overloaded answers (429/5xx), then move on to the next available Flash model
async function decideWithGemini(system: string, user: string): Promise<AgentDecision> {
  const key = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!key) throw new Error('No AI key configured (ANTHROPIC_API_KEY or GOOGLE_AI_API_KEY)');
  let models = [geminiModel];
  let lastError = '';
  for (let i = 0; i < models.length && i < 3; i++) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let res: Response, body: any;
      try {
        res = await callGemini(models[i], key, system, user);
        body = await res.json();
      } catch (e) {
        // no answer within 25s: treat like a busy model and move on to the next one
        lastError = `Gemini ${models[i]}: ${e instanceof Error ? e.message : e}`;
        break;
      }
      if (res.ok) {
        if (models[i] !== geminiModel) console.log(`instagram-agent: switched Gemini model to ${models[i]}`);
        geminiModel = models[i];
        const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return { category: 'other', action: 'review', reply: '', reason: 'No answer from the model; needs a human.' };
        return JSON.parse(text) as AgentDecision;
      }
      lastError = `Gemini error ${res.status} (${models[i]}): ${JSON.stringify(body.error ?? body)}`;
      const busy = res.status === 429 || res.status >= 500;
      if (busy && attempt === 0) { await sleep(3000); continue; }
      if (!busy && res.status !== 404) throw new Error(lastError);
      break; // retired or still busy: try another model
    }
    if (models.length === 1) models = [models[0], ...(await listGeminiFlashModels(key)).filter((m) => m !== models[0])];
  }
  throw new Error(lastError);
}
