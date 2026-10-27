// Instagram Comment Agent - replies to comments on the QUALITY LIGHT Instagram page as a lighting specialist.
// Entry points:
//   GET  ?hub.mode=subscribe...      Meta webhook verification
//   POST (X-Hub-Signature-256)       Meta webhook: new comments
//   POST { action: 'poll' }          cron safety net: scan recent posts for new comments
//   POST { action: ... } + admin JWT admin panel actions (settings, approve, ignore, regenerate, test)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.2';
import { decide, type AgentDecision } from './agent.ts';
import { DEFAULT_KNOWLEDGE } from './knowledge.ts';
import {
  getComment,
  getMe,
  getMedia,
  getMediaComments,
  getRecentMedia,
  getRecentMediaWithComments,
  refreshToken,
  replyToComment,
  verifySignature,
  type IgComment,
  type IgMedia,
} from './instagram.ts';

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

// Categories held for a human in hybrid mode even when the agent wants to reply
const HYBRID_REVIEW_CATEGORIES = ['complaint', 'other'];
const MAX_COMMENTS_PER_POLL = 5;
// A reply can take over a minute when the AI model is busy; stop starting new ones after this, to stay inside the function time limit
const POLL_TIME_BUDGET_MS = 50_000;

interface Settings {
  enabled: boolean;
  mode: 'hybrid' | 'approve_all' | 'auto';
  knowledge: string;
  extra_rules: string;
  active_since: string | null;
  ig_user_id: string | null;
  ig_app_user_id: string | null;
  ig_username: string | null;
  token_refreshed_at: string | null;
  last_poll_at: string | null;
}

interface IncomingComment {
  comment_id: string;
  media_id: string | null;
  media_caption?: string | null;
  media_permalink?: string | null;
  media_type?: string | null;
  parent_id?: string | null;
  parent_text?: string | null;
  from_id?: string | null;
  username?: string | null;
  text: string;
  commented_at: string;
  source: 'webhook' | 'poll';
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

// Instagram timestamps look like 2026-10-26T10:00:00+0000
const igTime = (t?: string) => (t ? new Date(t.replace(/\+0000$/, 'Z')).toISOString() : new Date().toISOString());

async function loadSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('ig_agent_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as Settings;
}

async function loadToken(): Promise<string | null> {
  const { data } = await supabase.from('ig_agent_secrets').select('access_token').eq('id', 1).single();
  return data?.access_token || Deno.env.get('IG_ACCESS_TOKEN') || null;
}

async function updateComment(id: string, patch: Record<string, unknown>) {
  await supabase.from('ig_comments').update({ ...patch, updated_at: new Date().toISOString() }).eq('comment_id', id);
}

function route(d: AgentDecision, mode: Settings['mode']): 'post' | 'pending_review' | 'ignored' {
  if (d.action === 'ignore') return 'ignored';
  if (d.action === 'review' || mode === 'approve_all') return 'pending_review';
  if (mode === 'hybrid' && HYBRID_REVIEW_CATEGORIES.includes(d.category)) return 'pending_review';
  return 'post';
}

async function postReply(row: { comment_id: string; parent_id?: string | null; username?: string | null }, reply: string, token: string) {
  const message = row.username ? `@${row.username} ${reply}` : reply;
  const res = await replyToComment(row.parent_id || row.comment_id, message, token);
  await updateComment(row.comment_id, {
    status: 'replied',
    final_reply: reply,
    reply_comment_id: res.id,
    replied_at: new Date().toISOString(),
    error: null,
  });
}

function isOwnComment(c: IncomingComment, s: Settings) {
  return (!!c.from_id && (c.from_id === s.ig_user_id || c.from_id === s.ig_app_user_id)) ||
    (!!c.username && !!s.ig_username && c.username.toLowerCase() === s.ig_username.toLowerCase());
}

// Comments written before the agent was switched on are never answered
const isActive = (c: IncomingComment, s: Settings) => !s.active_since || Date.parse(c.commented_at) >= Date.parse(s.active_since);

// Handle one comment end-to-end. Each comment is claimed once (primary key), so webhook + poll never double-reply.
async function handleComment(c: IncomingComment, s: Settings, token: string) {
  if (!s.enabled || !c.text?.trim() || isOwnComment(c, s)) return;
  if (!isActive(c, s)) return;

  const { data: claimed } = await supabase
    .from('ig_comments')
    .upsert({ ...c, status: 'processing' }, { onConflict: 'comment_id', ignoreDuplicates: true })
    .select('comment_id');
  if (!claimed?.length) return;
  await processComment(c, s, token);
}

async function processComment(c: IncomingComment, s: Settings, token: string) {
  try {
    if (c.media_id && c.media_caption === undefined) {
      const m = await getMedia(c.media_id, token).catch(() => null);
      c.media_caption = m?.caption ?? null;
      c.media_permalink = m?.permalink ?? null;
      await updateComment(c.comment_id, { media_caption: c.media_caption, media_permalink: c.media_permalink });
    }
    if (c.parent_id && !c.parent_text) {
      c.parent_text = (await getComment(c.parent_id, token).catch(() => null))?.text ?? null;
      await updateComment(c.comment_id, { parent_text: c.parent_text });
    }

    const d = await decide(
      { username: c.username, text: c.text, caption: c.media_caption, parentText: c.parent_text },
      s.knowledge.trim() || DEFAULT_KNOWLEDGE,
      s.extra_rules,
    );
    const next = route(d, s.mode);
    await updateComment(c.comment_id, {
      category: d.category,
      reason: d.reason,
      draft_reply: d.reply,
      status: next === 'post' ? 'processing' : next,
    });
    if (next === 'post') await postReply(c, d.reply, token);
  } catch (e) {
    console.error('instagram-agent: comment failed', c.comment_id, e);
    await updateComment(c.comment_id, { status: 'failed', error: String(e instanceof Error ? e.message : e) });
  }
}

// Failures are usually temporary (AI model busy), and a run cut off by the function time limit
// leaves a comment stuck in 'processing': pick one of those up again on each poll
async function retryFailed(s: Settings, token: string) {
  const ago = (min: number) => new Date(Date.now() - min * 60e3).toISOString();
  const { data: rows } = await supabase.from('ig_comments').select('*')
    .or(`and(status.eq.failed,updated_at.lt.${ago(3)}),and(status.eq.processing,updated_at.lt.${ago(10)})`)
    .gte('created_at', ago(6 * 60))
    .order('created_at').limit(1);
  for (const row of rows ?? []) {
    const { data: claimed } = await supabase.from('ig_comments')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('comment_id', row.comment_id).eq('updated_at', row.updated_at).select('comment_id');
    if (claimed?.length) await processComment(row as IncomingComment, s, token);
  }
  return rows?.length ?? 0;
}

async function handleWebhook(payload: any) {
  const s = await loadSettings();
  const token = await loadToken();
  if (!s.enabled || !token) return;
  for (const entry of payload?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'comments') continue;
      const v = change.value ?? {};
      if (!v.id || !v.text) continue;
      await handleComment({
        comment_id: v.id,
        media_id: v.media?.id ?? null,
        media_type: v.media?.media_product_type ?? null,
        parent_id: v.parent_id ?? null,
        from_id: v.from?.id ?? null,
        username: v.from?.username ?? null,
        text: v.text,
        commented_at: entry.time ? new Date(entry.time * (entry.time < 1e12 ? 1000 : 1)).toISOString() : new Date().toISOString(),
        source: 'webhook',
      }, s, token);
    }
  }
}

async function maybeRefreshToken(s: Settings, token: string) {
  const age = s.token_refreshed_at ? Date.now() - Date.parse(s.token_refreshed_at) : Infinity;
  if (age < 7 * 86400e3) return token;
  try {
    const r = await refreshToken(token);
    await supabase.from('ig_agent_secrets').update({ access_token: r.access_token, updated_at: new Date().toISOString() }).eq('id', 1);
    await supabase.from('ig_agent_settings').update({ token_refreshed_at: new Date().toISOString() }).eq('id', 1);
    return r.access_token;
  } catch (e) {
    console.error('instagram-agent: token refresh failed', e);
    return token;
  }
}

async function runPoll(force = false) {
  const started = Date.now();
  const s = await loadSettings();
  let token = await loadToken();
  if (!s.enabled || !token) return { skipped: 'agent disabled or not connected' };
  if (!force && s.last_poll_at && Date.now() - Date.parse(s.last_poll_at) < 60e3) return { skipped: 'polled recently' };
  await supabase.from('ig_agent_settings').update({ last_poll_at: new Date().toISOString() }).eq('id', 1);
  token = await maybeRefreshToken(s, token);

  let posts: { media: IgMedia; comments: IgComment[] }[];
  try {
    posts = await getRecentMediaWithComments(token);
    // some accounts get no nested comments back; ask each post that has comments directly
    if (!posts.some((p) => p.comments.length) && posts.some((p) => (p.media.comments_count ?? 0) > 0)) {
      for (const p of posts) if ((p.media.comments_count ?? 0) > 0) p.comments = await getMediaComments(p.media.id, token);
    }
  } catch (e) {
    // fall back to one call per post if field expansion is refused
    console.error('instagram-agent: expanded media fetch failed, falling back', e);
    posts = [];
    for (const m of await getRecentMedia(token)) posts.push({ media: m, comments: await getMediaComments(m.id, token) });
  }

  const found: IncomingComment[] = [];
  for (const { media: m, comments } of posts) {
    for (const top of comments) {
      const base = { media_id: m.id, media_caption: m.caption ?? null, media_permalink: m.permalink ?? null, media_type: m.media_product_type ?? null, source: 'poll' as const };
      found.push({ ...base, comment_id: top.id, text: top.text ?? '', username: top.username ?? top.from?.username ?? null, from_id: top.from?.id ?? null, commented_at: igTime(top.timestamp) });
      for (const r of top.replies?.data ?? []) {
        found.push({ ...base, comment_id: r.id, text: r.text ?? '', username: r.username ?? r.from?.username ?? null, from_id: r.from?.id ?? null, commented_at: igTime(r.timestamp), parent_id: top.id, parent_text: top.text ?? null });
      }
    }
  }

  const fresh = found.filter((c) => c.text.trim() && !isOwnComment(c, s) && isActive(c, s));
  const retried = await retryFailed(s, token);
  if (retried) console.log(`instagram-agent poll: retried ${retried} earlier comment(s)`);
  console.log(`instagram-agent poll: ${posts.length} posts (${posts.reduce((n, p) => n + (p.media.comments_count ?? 0), 0)} comments on Instagram), ${found.length} comments readable, ${fresh.length} newer than start time`);
  if (!fresh.length) return { scanned: found.length, handled: 0 };
  const { data: known } = await supabase.from('ig_comments').select('comment_id').in('comment_id', fresh.map((c) => c.comment_id));
  const knownIds = new Set((known ?? []).map((r) => r.comment_id));
  const todo = fresh.filter((c) => !knownIds.has(c.comment_id))
    .sort((a, b) => a.commented_at.localeCompare(b.commented_at))
    .slice(0, MAX_COMMENTS_PER_POLL);
  for (const c of todo) {
    if (Date.now() - started > POLL_TIME_BUDGET_MS) break; // the rest waits for the next poll
    await handleComment(c, s, token);
  }
  return { scanned: found.length, handled: todo.length };
}

async function requireAdmin(req: Request) {
  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!jwt) return false;
  const { data: { user } } = await supabase.auth.getUser(jwt);
  if (!user) return false;
  const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  return data === true;
}

async function adminAction(body: any) {
  const s = await loadSettings();
  switch (body.action) {
    case 'status': {
      const token = await loadToken();
      return { settings: s, connected: !!token, default_knowledge: DEFAULT_KNOWLEDGE };
    }
    case 'save_settings': {
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const k of ['mode', 'knowledge', 'extra_rules'] as const) if (body[k] !== undefined) patch[k] = body[k];
      if (body.enabled !== undefined) {
        patch.enabled = !!body.enabled;
        // switching on starts a new window: older comments are never answered
        if (body.enabled && !s.enabled) patch.active_since = new Date().toISOString();
      }
      const { error } = await supabase.from('ig_agent_settings').update(patch).eq('id', 1);
      if (error) throw error;
      return { ok: true };
    }
    case 'save_token': {
      const token = String(body.token ?? '').trim();
      const me = await getMe(token);
      await supabase.from('ig_agent_secrets').update({ access_token: token, updated_at: new Date().toISOString() }).eq('id', 1);
      await supabase.from('ig_agent_settings').update({
        ig_user_id: me.user_id ?? null,
        ig_app_user_id: me.id,
        ig_username: me.username ?? null,
        token_refreshed_at: new Date().toISOString(),
      }).eq('id', 1);
      return { ok: true, username: me.username };
    }
    case 'approve': {
      const token = await loadToken();
      if (!token) throw new Error('Instagram is not connected');
      const { data: row } = await supabase.from('ig_comments').select('comment_id,parent_id,username').eq('comment_id', body.comment_id).single();
      if (!row) throw new Error('Comment not found');
      await postReply(row, String(body.reply ?? '').trim(), token);
      return { ok: true };
    }
    case 'ignore':
      await updateComment(body.comment_id, { status: 'ignored' });
      return { ok: true };
    case 'regenerate': {
      const { data: row } = await supabase.from('ig_comments').select('*').eq('comment_id', body.comment_id).single();
      if (!row) throw new Error('Comment not found');
      const d = await decide({ username: row.username, text: row.text, caption: row.media_caption, parentText: row.parent_text }, s.knowledge.trim() || DEFAULT_KNOWLEDGE, s.extra_rules);
      await updateComment(row.comment_id, { category: d.category, reason: d.reason, draft_reply: d.reply, status: 'pending_review', error: null });
      return { ok: true, decision: d };
    }
    case 'test': {
      const d = await decide({ username: 'test_user', text: String(body.text ?? ''), caption: body.caption ?? null }, s.knowledge.trim() || DEFAULT_KNOWLEDGE, s.extra_rules);
      return { decision: d, route: route(d, s.mode) };
    }
    case 'poll_now':
      return await runPoll(true);
    default:
      throw new Error(`Unknown action: ${body.action}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const url = new URL(req.url);

  try {
    // Meta webhook verification handshake
    if (req.method === 'GET') {
      const ok = url.searchParams.get('hub.mode') === 'subscribe' &&
        url.searchParams.get('hub.verify_token') === Deno.env.get('IG_VERIFY_TOKEN');
      return ok ? new Response(url.searchParams.get('hub.challenge') ?? '', { status: 200 }) : new Response('Forbidden', { status: 403 });
    }

    const raw = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    if (signature) {
      if (!(await verifySignature(raw, signature, Deno.env.get('IG_APP_SECRET') ?? ''))) return new Response('Invalid signature', { status: 401 });
      // Answer Meta right away; process in the background
      EdgeRuntime.waitUntil(handleWebhook(JSON.parse(raw)).catch((e) => console.error('instagram-agent: webhook failed', e)));
      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    const body = raw ? JSON.parse(raw) : {};
    if (body.action === 'poll') return json(await runPoll());
    if (!(await requireAdmin(req))) return json({ error: 'Unauthorized' }, 401);
    return json(await adminAction(body));
  } catch (e) {
    console.error('instagram-agent error:', e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
