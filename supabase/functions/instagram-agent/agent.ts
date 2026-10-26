// Claude decides how to handle one Instagram comment and drafts the reply.
import Anthropic from 'npm:@anthropic-ai/sdk@1.3.0';
import { REPLY_RULES } from './knowledge.ts';

const MODEL = Deno.env.get('IG_AGENT_MODEL') || 'claude-opus-5-5';

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
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY

  const system = `${REPLY_RULES}\n\n<knowledge>\n${knowledge}\n</knowledge>${extraRules.trim() ? `\n\nقواعد إضافية من صاحب الصفحة:\n${extraRules}` : ''}`;
  const parts = [
    ctx.caption ? `<post_caption>\n${ctx.caption}\n</post_caption>` : '',
    ctx.parentText ? `<parent_comment>\n${ctx.parentText}\n</parent_comment>` : '',
    `<comment username="${(ctx.username ?? '').replace(/"/g, '')}">\n${ctx.text}\n</comment>`,
  ].filter(Boolean);

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
    // knowledge + rules are identical across comments, so cache them
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: parts.join('\n\n') }],
  });

  if (response.stop_reason === 'refusal') {
    return { category: 'other', action: 'review', reply: '', reason: 'The model declined this comment; needs a human.' };
  }
  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error(`No text in model response (stop_reason=${response.stop_reason})`);
  const d = JSON.parse(text.text) as AgentDecision;
  if (d.action !== 'ignore' && !d.reply.trim()) d.action = 'review';
  return d;
}
