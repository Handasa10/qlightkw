// Content Events - what the owner did in the QL Studio bot since a given time, for the Claude session's watcher.
// POST { since: ISO time } + x-studio-token  ->  { now, questions, voices, items } changed after `since`.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const STUDIO_TOKEN = Deno.env.get('STUDIO_TOKEN') || '';

async function same(a: string, b: string) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < p.length; i++) d |= p[i] ^ q[i];
  return d === 0;
}

Deno.serve(async (req) => {
  if (!STUDIO_TOKEN || !(await same(req.headers.get('x-studio-token') ?? '', STUDIO_TOKEN))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const since = new Date(body.since || Date.now() - 3600e3).toISOString();
  const [q, v, i] = await Promise.all([
    supabase.from('content_questions').select('id, header, question, options, selected, answer_text, answered_at').eq('status', 'answered').gt('answered_at', since).neq('options', '[]').order('answered_at'),
    supabase.from('content_voices').select('id, item_id, title, status, take, url, error, updated_at').gt('updated_at', since).in('status', ['approved', 'failed', 'ready']).order('updated_at'),
    supabase.from('content_items').select('id, kind, status, topic, feedback, revise_from, scheduled_at, updated_at').gt('updated_at', since).in('status', ['idea_approved', 'script_approved', 'approved', 'revise', 'rejected']).order('updated_at'),
  ]);
  return new Response(JSON.stringify({ now: new Date().toISOString(), questions: q.data ?? [], voices: v.data ?? [], items: i.data ?? [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
