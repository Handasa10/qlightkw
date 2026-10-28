// Content Studio - reel + image post pipeline for the QUALITY LIGHT social pages.
// idea -> script -> media -> owner approval (Telegram) -> next free slot -> the Claude session schedules it on Postora
// (publisher 'postora', the default) or this function publishes on Instagram + Facebook itself (publisher 'meta').
// Single file on purpose: it can be pasted as-is into the Supabase dashboard editor.
// Entry points:
//   POST + x-telegram-bot-api-secret-token   Telegram bot updates (approve / reject / ask for changes)
//   POST { action: 'tick' }                   cron every 5 min: keep the Telegram webhook set, send queued questions; in 'meta' mode publish due posts
//   POST { action: 'flush' }                  send queued questions / messages (content_questions) to the owner now
//   POST { action: ... } + x-studio-token     Claude studio sessions: list / create / update items, signed upload URLs, tts voices

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.93.2';

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const BOT_TOKEN = Deno.env.get('STUDIO_TELEGRAM_BOT_TOKEN') || '';
const STUDIO_TOKEN = Deno.env.get('STUDIO_TOKEN') || '';
const IG_BASE = `https://graph.instagram.com/${Deno.env.get('IG_API_VERSION') || 'v23.0'}`;
const FB_BASE = `https://graph.facebook.com/${Deno.env.get('FB_API_VERSION') || 'v23.0'}`;
const FB_PAGE_ID = Deno.env.get('FB_PAGE_ID') || '';
const FB_PAGE_TOKEN = Deno.env.get('FB_PAGE_ACCESS_TOKEN') || '';
const BUCKET = 'content-media';
const KW_OFFSET_H = 3; // Kuwait is UTC+3 all year
const IG_PROCESSING_TIMEOUT_MS = 45 * 60e3;

interface Settings {
  paused: boolean;
  publisher: 'postora' | 'meta';
  reel_slots: string[];
  image_slots: string[];
  publish_instagram: boolean;
  publish_facebook: boolean;
  telegram_chat_id: number | null;
  telegram_webhook_url: string | null;
}

interface Item {
  id: string;
  kind: 'reel' | 'image';
  status: string;
  topic: string;
  hook?: string | null;
  angle?: string | null;
  script?: string | null;
  voice_description?: string | null;
  caption?: string | null;
  feedback?: string | null;
  revise_from?: string | null;
  media_url?: string | null;
  preview_url?: string | null;
  cover_url?: string | null;
  scheduled_at?: string | null;
  platforms?: string[] | null;
  ig_container_id?: string | null;
  ig_media_id?: string | null;
  ig_permalink?: string | null;
  ig_status?: string | null;
  fb_post_id?: string | null;
  fb_status?: string | null;
  publish_started_at?: string | null;
  error?: string | null;
}

// fields a studio session may set on an item
const EDITABLE = ['kind', 'status', 'topic', 'hook', 'angle', 'script', 'voice_description', 'caption', 'feedback', 'media_url', 'preview_url', 'cover_url', 'duration_sec', 'scheduled_at', 'error', 'platforms', 'postora_post_ids'];
// statuses that wait for the owner and are sent to Telegram when an item reaches them
const NEEDS_OWNER = ['idea', 'script_ready', 'media_ready'];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));
const esc = (s?: string | null) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KIND_AR: Record<string, string> = { reel: 'ريل 🎬', image: 'بوست صورة 🖼️' };

async function loadSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('content_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as Settings;
}

async function getItem(id: string): Promise<Item | null> {
  const { data } = await supabase.from('content_items').select('*').eq('id', id).maybeSingle();
  return data as Item | null;
}

async function patchItem(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from('content_items').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

// ---------------- scheduling (Kuwait local slots) ----------------

function slotTime(dayOffset: number, hhmm: string, now = new Date()): Date {
  const kw = new Date(now.getTime() + KW_OFFSET_H * 3600e3);
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(kw.getUTCFullYear(), kw.getUTCMonth(), kw.getUTCDate() + dayOffset, h - KW_OFFSET_H, m));
}

async function nextFreeSlot(kind: Item['kind'], s: Settings): Promise<Date> {
  const slots = [...(kind === 'reel' ? s.reel_slots : s.image_slots)].sort();
  const { data } = await supabase.from('content_items').select('scheduled_at')
    .in('status', ['approved', 'scheduled', 'publishing', 'published']).not('scheduled_at', 'is', null)
    .gte('scheduled_at', new Date(Date.now() - 3600e3).toISOString());
  const taken = new Set((data ?? []).map((r) => Math.round(Date.parse(r.scheduled_at) / 60e3)));
  const earliest = Date.now() + 20 * 60e3;
  for (let d = 0; d < 120; d++) {
    for (const hhmm of slots) {
      const t = slotTime(d, hhmm);
      if (t.getTime() >= earliest && !taken.has(Math.round(t.getTime() / 60e3))) return t;
    }
  }
  throw new Error('No free slot in the next 120 days');
}

const kwTime = (iso?: string | null) => iso
  ? new Date(iso).toLocaleString('ar-EG', { timeZone: 'Asia/Kuwait', weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' })
  : '—';

// ---------------- Telegram ----------------

async function tg<T = any>(method: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!body.ok) throw new Error(`Telegram ${method}: ${body.description ?? res.status}`);
  return body.result as T;
}

// Telegram only accepts A-Z a-z 0-9 _ - in the webhook secret; derive it from the bot token
async function webhookSecret() {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`content-studio:${BOT_TOKEN}`)));
  return Array.from(hash.slice(0, 24), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function ensureTelegramWebhook(s: Settings) {
  if (!BOT_TOKEN) return;
  const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/content-studio`;
  if (s.telegram_webhook_url === url) return;
  await tg('setWebhook', { url, secret_token: await webhookSecret(), allowed_updates: ['message', 'callback_query'] });
  await supabase.from('content_settings').update({ telegram_webhook_url: url }).eq('id', 1);
  s.telegram_webhook_url = url;
}

// Send to the owner; long texts are split (Telegram caps a message at 4096 chars), buttons go on the last part.
async function send(s: Settings, text: string, itemId: string | null, extra: Record<string, unknown> = {}) {
  if (!BOT_TOKEN || !s.telegram_chat_id) return;
  const parts: string[] = [];
  let rest = text;
  while (rest.length > 3900) {
    const cut = rest.lastIndexOf('\n', 3900) > 1000 ? rest.lastIndexOf('\n', 3900) : 3900;
    parts.push(rest.slice(0, cut)); rest = rest.slice(cut);
  }
  parts.push(rest);
  for (let i = 0; i < parts.length; i++) {
    const last = i === parts.length - 1;
    const m = await tg<{ message_id: number }>('sendMessage', {
      chat_id: s.telegram_chat_id, text: parts[i], parse_mode: 'HTML', disable_web_page_preview: true, ...(last ? extra : {}),
    });
    if (itemId) await supabase.from('content_tg_messages').upsert({ message_id: m.message_id, item_id: itemId });
  }
}

const approveButtons = (it: Item, okText: string) => ({
  inline_keyboard: [[{ text: okText, callback_data: `ok:${it.id}` }, { text: '❌ رفض', callback_data: `no:${it.id}` }]],
});
const EDIT_HINT = '\n\n<i>✏️ عاوز تعديل؟ اعمل Reply على الرسالة دي واكتب ملاحظاتك.</i>';

async function notifyOwner(s: Settings, it: Item) {
  try {
    const head = `${KIND_AR[it.kind] ?? it.kind} · <b>${esc(it.topic)}</b>`;
    if (it.status === 'idea') {
      await send(s, `💡 <b>فكرة جديدة</b>\n${head}${it.hook ? `\n🎣 ${esc(it.hook)}` : ''}${it.angle ? `\n🧭 ${esc(it.angle)}` : ''}${EDIT_HINT}`, it.id,
        { reply_markup: approveButtons(it, '✅ موافقة') });
    } else if (it.status === 'script_ready') {
      const body = [
        `📝 <b>${it.kind === 'reel' ? 'السكريبت جاهز' : 'نص البوست جاهز'}</b>\n${head}`,
        it.voice_description ? `🎙️ <b>وصف الصوت</b>\n<pre>${esc(it.voice_description)}</pre>` : '',
        it.script ? `<pre>${esc(it.script)}</pre>` : '',
        it.caption ? `✍️ <b>الكابشن</b>\n${esc(it.caption)}` : '',
      ].filter(Boolean).join('\n\n');
      await send(s, body + EDIT_HINT, it.id, { reply_markup: approveButtons(it, '✅ موافقة على السكريبت') });
    } else if (it.status === 'media_ready') {
      const media = it.kind === 'reel' ? (it.preview_url || it.media_url) : it.media_url;
      if (media) {
        try {
          const m = await tg<{ message_id: number }>(it.kind === 'reel' ? 'sendVideo' : 'sendPhoto', {
            chat_id: s.telegram_chat_id, [it.kind === 'reel' ? 'video' : 'photo']: media, caption: `${it.kind === 'reel' ? '🎬' : '🖼️'} ${it.topic}`.slice(0, 1000),
            ...(it.kind === 'reel' ? { supports_streaming: true } : {}),
          });
          await supabase.from('content_tg_messages').upsert({ message_id: m.message_id, item_id: it.id });
        } catch (e) {
          await send(s, `⚠️ ما قدرتش أعرض الملف جوه تليجرام (${esc(errMsg(e))})\n🔗 ${esc(media)}`, it.id);
        }
      }
      await send(s, `✅ <b>جاهز للنشر؟</b>\n${head}\n\n✍️ <b>الكابشن</b>\n${esc(it.caption ?? '')}\n\n🔗 <a href="${esc(it.media_url ?? '')}">الملف بالجودة الكاملة</a>${EDIT_HINT}`, it.id,
        { reply_markup: approveButtons(it, '✅ وافق وجدول') });
    }
  } catch (e) {
    console.error('content-studio: notify failed', e);
  }
}

const HELP = `أهلًا 👋 ده بوت استوديو محتوى كواليتي لايت.

• الأفكار والسكريبتات والفيديوهات هتوصلك هنا للموافقة.
• ✅ موافقة تنقل الخطوة للي بعدها، و❌ رفض يلغيها.
• اعمل Reply على أي رسالة واكتب ملاحظاتك، وهتتعدّل في جلسة الاستوديو الجاية.
• الفيديو اللي توافق عليه بياخد أقرب ميعاد فاضي (9:00 · 14:00 · 18:00) ويتجدول على المنصات اللي اخترتها عن طريق Postora.

الأوامر:
/queue المجدول للنشر
/pending اللي مستني موافقتك
/status ملخص
/pause إيقاف النشر
/resume تشغيل النشر`;

// ---------------- questions from the Claude session (choice cards answered in the bot) ----------------

interface Question {
  id: number;
  header: string | null;
  question: string;
  options: { label: string; description?: string }[];
  multi: boolean;
  recommended: number | null;
  status: string;
  selected: number[];
  message_id: number | null;
}

function questionText(q: Question) {
  const lines = [q.header ? `🧭 <b>${esc(q.header)}</b>` : '', `<b>${esc(q.question)}</b>`];
  q.options.forEach((o, i) => lines.push(`${i === (q.recommended ?? -1) ? '⭐' : '▫️'} <b>${i + 1}) ${esc(o.label)}</b>${o.description ? `\n      ${esc(o.description)}` : ''}`));
  if (q.options.length) lines.push(q.multi ? '\n<i>اختار واحد أو أكتر وبعدين اضغط «تم ✅»، أو اكتب ردك.</i>' : '\n<i>اضغط اختيارك، أو اكتب ردك (مثلًا رقم الاختيار أو اقتراح تاني).</i>');
  return lines.filter(Boolean).join('\n');
}

function questionKeyboard(q: Question) {
  const rows = q.options.map((o, i) => {
    const on = q.selected.includes(i);
    const label = `${q.multi ? (on ? '☑️ ' : '⬜ ') : ''}${i === (q.recommended ?? -1) ? '⭐ ' : ''}${i + 1}) ${o.label}`.slice(0, 60);
    return [{ text: label, callback_data: `${q.multi ? 'qt' : 'qa'}:${q.id}:${i}` }];
  });
  if (q.multi) rows.push([{ text: 'تم ✅', callback_data: `qd:${q.id}` }]);
  return { inline_keyboard: rows };
}

// send every pending question/message to the owner, oldest first
async function flushQuestions(s: Settings) {
  if (!BOT_TOKEN || !s.telegram_chat_id) return { sent: 0, reason: 'bot not linked' };
  const { data } = await supabase.from('content_questions').select('*').eq('status', 'pending').order('id', { ascending: true }).limit(20);
  let sent = 0;
  for (const q of (data ?? []) as Question[]) {
    try {
      if (!q.options?.length) {
        await send(s, q.question, null);
        await supabase.from('content_questions').update({ status: 'answered', sent_at: new Date().toISOString(), answered_at: new Date().toISOString() }).eq('id', q.id);
      } else {
        const m = await tg<{ message_id: number }>('sendMessage', {
          chat_id: s.telegram_chat_id, text: questionText(q), parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: questionKeyboard(q),
        });
        await supabase.from('content_questions').update({ status: 'sent', sent_at: new Date().toISOString(), message_id: m.message_id }).eq('id', q.id);
      }
      sent++;
    } catch (e) {
      console.error('content-studio: question send failed', q.id, e);
    }
  }
  return { sent };
}

async function answerQuestion(s: Settings, q: Question, selected: number[], text: string | null) {
  await supabase.from('content_questions').update({ status: 'answered', selected, answer_text: text, answered_at: new Date().toISOString() }).eq('id', q.id);
  if (q.message_id) await tg('editMessageReplyMarkup', { chat_id: s.telegram_chat_id, message_id: q.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
  const picked = selected.map((i) => q.options[i]?.label).filter(Boolean).join(' + ');
  await send(s, `✅ وصلني: ${esc(picked || text || '')}`, null, q.message_id ? { reply_to_message_id: q.message_id } : {});
}

async function handleQuestionCallback(s: Settings, cb: any): Promise<boolean> {
  const [act, id, idx] = String(cb.data ?? '').split(':');
  if (!['qa', 'qt', 'qd'].includes(act)) return false;
  const { data } = await supabase.from('content_questions').select('*').eq('id', Number(id)).maybeSingle();
  const q = data as Question | null;
  if (!q || q.status !== 'sent') {
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'السؤال ده اتقفل' }).catch(() => {});
    return true;
  }
  if (act === 'qa') {
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: q.options[Number(idx)]?.label?.slice(0, 190) ?? '✅' }).catch(() => {});
    await answerQuestion(s, q, [Number(idx)], null);
  } else if (act === 'qt') {
    const i = Number(idx);
    q.selected = q.selected.includes(i) ? q.selected.filter((x) => x !== i) : [...q.selected, i].sort();
    await supabase.from('content_questions').update({ selected: q.selected }).eq('id', q.id);
    await tg('answerCallbackQuery', { callback_query_id: cb.id }).catch(() => {});
    await tg('editMessageReplyMarkup', { chat_id: s.telegram_chat_id, message_id: cb.message.message_id, reply_markup: questionKeyboard(q) }).catch(() => {});
  } else {
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: '✅' }).catch(() => {});
    await answerQuestion(s, q, q.selected, null);
  }
  return true;
}

// typed answer: a reply to a card, or plain text while a card is open (a number picks that option)
async function handleQuestionText(s: Settings, typed: string, replyTo?: number): Promise<boolean> {
  const text = typed.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660)); // Arabic-Indic digits
  let q: Question | null = null;
  if (replyTo) {
    const { data } = await supabase.from('content_questions').select('*').eq('message_id', replyTo).eq('status', 'sent').maybeSingle();
    q = data as Question | null;
  } else {
    const { data } = await supabase.from('content_questions').select('*').eq('status', 'sent').order('id', { ascending: false }).limit(1);
    q = (data?.[0] as Question) ?? null;
  }
  if (!q) return false;
  const nums = (text.match(/\d+/g) ?? []).map(Number).filter((n) => n >= 1 && n <= q!.options.length);
  const onlyNumbers = /^[\d\s,،+و]+$/.test(text) && nums.length > 0;
  await answerQuestion(s, q, onlyNumbers ? nums.map((n) => n - 1) : [], onlyNumbers ? null : text);
  return true;
}

// ---------------- voice-overs (Gemini TTS, the AI Studio voices) ----------------

const GOOGLE_KEY = Deno.env.get('GOOGLE_AI_API_KEY') || '';
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta';

interface Voice {
  id: string;
  title: string | null;
  script: string;
  voice_description: string | null;
  voice: string;
  status: string;
  take: number;
  message_id: number | null;
}

// TTS models to try in order: STUDIO_TTS_MODEL first if set, then pro before flash, newest first
async function ttsModels(): Promise<string[]> {
  const res = await fetch(`${GEMINI}/models?pageSize=1000`, { headers: { 'x-goog-api-key': GOOGLE_KEY } });
  const names: string[] = ((await res.json()).models ?? []).map((m: { name: string }) => m.name.split('/').pop()).filter((n: string) => n.includes('tts'));
  names.sort((a, b) => (Number(b.includes('pro')) - Number(a.includes('pro'))) || b.localeCompare(a));
  const fixed = Deno.env.get('STUDIO_TTS_MODEL');
  const list = fixed ? [fixed, ...names.filter((n) => n !== fixed)] : names;
  if (!list.length) throw new Error('no Gemini TTS model available for this key');
  return list;
}

// one TTS call per model until one answers; quota / overload errors move on to the next model
async function synthesize(text: string, voice: string) {
  let last = '';
  for (const model of await ttsModels()) {
    const res = await fetch(`${GEMINI}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GOOGLE_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }),
    });
    const body = await res.json().catch(() => ({}));
    const part = body.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData;
    if (res.ok && part) return { model, part };
    last = `${model}: ${body.error?.message?.split('\n')[0] || `HTTP ${res.status}`}`;
    if (![429, 500, 503, 404].includes(res.status)) break;
  }
  throw new Error(last || 'TTS failed');
}

function wavFile(pcm: Uint8Array, rate: number) {
  const h = new DataView(new ArrayBuffer(44));
  const str = (o: number, t: string) => [...t].forEach((c, i) => h.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); h.setUint32(4, 36 + pcm.length, true); str(8, 'WAVE'); str(12, 'fmt ');
  h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 1, true); h.setUint32(24, rate, true);
  h.setUint32(28, rate * 2, true); h.setUint16(32, 2, true); h.setUint16(34, 16, true); str(36, 'data'); h.setUint32(40, pcm.length, true);
  const out = new Uint8Array(44 + pcm.length); out.set(new Uint8Array(h.buffer), 0); out.set(pcm, 44);
  return out;
}

// generate one take, store it in the bucket and send it to the owner with approve / regenerate buttons
async function makeVoice(s: Settings, v: Voice) {
  try {
    if (!GOOGLE_KEY) throw new Error('GOOGLE_AI_API_KEY is not set in the function secrets');
    const { model, part } = await synthesize(`${v.voice_description ?? ''}\n\n${v.script}`.trim(), v.voice);
    const rate = Number(/rate=(\d+)/.exec(part.mimeType ?? '')?.[1] ?? 24000);
    const pcm = Uint8Array.from(atob(part.data), (c) => c.charCodeAt(0));
    const wav = wavFile(pcm, rate);
    const path = `voices/${v.id}-take${v.take}.wav`;
    const up = await supabase.storage.from(BUCKET).upload(path, wav, { contentType: 'audio/wav', upsert: true });
    if (up.error) throw up.error;
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const duration = Math.round(pcm.length / 2 / rate * 10) / 10;

    let messageId: number | null = null;
    if (BOT_TOKEN && s.telegram_chat_id) {
      const form = new FormData();
      form.append('chat_id', String(s.telegram_chat_id));
      form.append('document', new Blob([wav], { type: 'audio/wav' }), `${(v.title || 'voice').replace(/[^\p{L}\p{N}_ -]/gu, '').trim() || 'voice'} - take ${v.take}.wav`);
      form.append('caption', `🎙️ ${v.title ?? 'الصوت'} · نسخة ${v.take} · ${duration} ثانية · صوت ${v.voice}`.slice(0, 1000));
      form.append('reply_markup', JSON.stringify({ inline_keyboard: [[{ text: '✅ موافق', callback_data: `va:${v.id}` }, { text: '🔁 ولّد تاني', callback_data: `vr:${v.id}` }]] }));
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, { method: 'POST', body: form });
      const tgBody = await tgRes.json();
      if (!tgBody.ok) throw new Error(`Telegram sendDocument: ${tgBody.description ?? tgRes.status}`);
      messageId = tgBody.result.message_id;
    }
    await supabase.from('content_voices').update({ status: 'ready', model, url, duration_sec: duration, message_id: messageId, error: null, updated_at: new Date().toISOString() }).eq('id', v.id);
    return { id: v.id, url, duration_sec: duration, model };
  } catch (e) {
    await supabase.from('content_voices').update({ status: 'failed', error: errMsg(e), updated_at: new Date().toISOString() }).eq('id', v.id);
    await send(s, `❌ ما قدرتش أولّد الصوت: ${esc(errMsg(e))}`, null).catch(() => {});
    throw e;
  }
}

async function handleVoiceCallback(s: Settings, cb: any): Promise<boolean> {
  const [act, id] = String(cb.data ?? '').split(':');
  if (!['va', 'vr'].includes(act)) return false;
  const { data } = await supabase.from('content_voices').select('*').eq('id', id).maybeSingle();
  const v = data as Voice | null;
  if (!v || v.status !== 'ready') {
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'الصوت ده اتقفل' }).catch(() => {});
    return true;
  }
  await tg('editMessageReplyMarkup', { chat_id: s.telegram_chat_id, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
  if (act === 'va') {
    await supabase.from('content_voices').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', v.id);
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: '✅' }).catch(() => {});
    await send(s, '✅ الصوت اتوافق عليه، وهبدأ الفيديو.', null, { reply_to_message_id: cb.message.message_id });
  } else {
    await supabase.from('content_voices').update({ status: 'regenerating', take: v.take + 1, updated_at: new Date().toISOString() }).eq('id', v.id);
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: '🔁 بولّد نسخة جديدة…' }).catch(() => {});
    await send(s, '🔁 بولّد نسخة جديدة، دقيقة وتوصلك.', null, { reply_to_message_id: cb.message.message_id });
    await makeVoice(s, { ...v, take: v.take + 1 }).catch(() => {});
  }
  return true;
}

async function handleTelegram(update: any) {
  const s = await loadSettings();
  const msg = update.message;
  const cb = update.callback_query;
  const chatId: number | undefined = msg?.chat?.id ?? cb?.message?.chat?.id;
  if (!chatId) return;

  // the first person to press /start owns the bot; everyone else is turned away
  if (!s.telegram_chat_id) {
    if (msg?.text?.startsWith('/start')) {
      await supabase.from('content_settings').update({ telegram_chat_id: chatId }).eq('id', 1);
      s.telegram_chat_id = chatId;
      await send(s, HELP, null);
    }
    return;
  }
  if (chatId !== Number(s.telegram_chat_id)) {
    if (msg) await tg('sendMessage', { chat_id: chatId, text: 'البوت ده خاص بصاحب الصفحة.' }).catch(() => {});
    return;
  }

  if (cb) {
    if (await handleQuestionCallback(s, cb)) return;
    if (await handleVoiceCallback(s, cb)) return;
    const [act, id] = String(cb.data ?? '').split(':');
    const it = await getItem(id);
    let answer = 'مش لاقي العنصر ده';
    if (it) answer = await ownerDecision(s, it, act);
    await tg('answerCallbackQuery', { callback_query_id: cb.id, text: answer.slice(0, 190) }).catch(() => {});
    await tg('editMessageReplyMarkup', { chat_id: chatId, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
    await send(s, answer, null, { reply_to_message_id: cb.message.message_id });
    return;
  }

  const text: string = (msg?.text ?? msg?.caption ?? '').trim();
  if (!text) return;
  const replyTo = msg.reply_to_message?.message_id;
  if (!text.startsWith('/') && await handleQuestionText(s, text, replyTo)) return;
  if (replyTo) {
    const { data: link } = await supabase.from('content_tg_messages').select('item_id').eq('message_id', replyTo).maybeSingle();
    const it = link ? await getItem(link.item_id) : null;
    if (!it) {
      await send(s, 'مش لاقي العنصر المرتبط بالرسالة دي. اعمل Reply على رسالة فكرة أو سكريبت أو فيديو.', null, { reply_to_message_id: msg.message_id });
      return;
    }
    if (['publishing', 'published'].includes(it.status)) {
      await send(s, 'العنصر ده اتنشر خلاص، مينفعش يتعدّل.', null, { reply_to_message_id: msg.message_id });
      return;
    }
    const from = it.status === 'revise' ? it.revise_from : it.status;
    await patchItem(it.id, { status: 'revise', revise_from: from, feedback: it.status === 'revise' && it.feedback ? `${it.feedback}\n${text}` : text, scheduled_at: null });
    await send(s, '✏️ تمام، ملاحظاتك اتسجلت وهتتعدّل في جلسة الاستوديو الجاية.', it.id, { reply_to_message_id: msg.message_id });
    return;
  }

  if (text.startsWith('/pause') || text.startsWith('/resume')) {
    const paused = text.startsWith('/pause');
    await supabase.from('content_settings').update({ paused }).eq('id', 1);
    await send(s, paused ? '⏸ النشر وقف. المجدول هيستنى لحد ما تبعت /resume.' : '▶️ النشر اشتغل.', null);
  } else if (text.startsWith('/queue')) {
    const { data } = await supabase.from('content_items').select('*').in('status', ['approved', 'scheduled', 'publishing'])
      .order('scheduled_at', { ascending: true }).limit(15);
    const lines = (data ?? []).map((r: Item) => `• ${kwTime(r.scheduled_at)} · ${KIND_AR[r.kind]} · ${esc(r.topic)}`);
    await send(s, lines.length ? `🗓️ <b>المجدول</b>\n${lines.join('\n')}` : 'مفيش حاجة مجدولة دلوقتي.', null);
  } else if (text.startsWith('/pending')) {
    const { data } = await supabase.from('content_items').select('*').in('status', NEEDS_OWNER).order('created_at', { ascending: true }).limit(10);
    if (!data?.length) await send(s, 'مفيش حاجة مستنية موافقتك 👌', null);
    for (const it of (data ?? []) as Item[]) await notifyOwner(s, it);
  } else if (text.startsWith('/status')) {
    const { data } = await supabase.from('content_items').select('status, kind');
    const n = (st: string, k?: string) => (data ?? []).filter((r) => r.status === st && (!k || r.kind === k)).length;
    await send(s, `📊 <b>الاستوديو</b>
💡 أفكار مستنية موافقتك: ${n('idea')}
📝 سكريبتات مستنية موافقتك: ${n('script_ready')}
🎬 جاهز للمراجعة: ${n('media_ready')}
✏️ مستني تعديل: ${n('revise')}
🛠️ تحت التنفيذ: ${n('idea_approved') + n('script_approved')}
🗓️ مجدول: ريلز ${n('approved', 'reel') + n('scheduled', 'reel')} · صور ${n('approved', 'image') + n('scheduled', 'image')}
✅ اتنشر: ${n('published')} · ❌ فشل: ${n('failed')}

النشر ${s.paused ? 'واقف ⏸' : 'شغّال ▶️'}`, null);
  } else {
    await send(s, HELP, null);
  }
}

async function ownerDecision(s: Settings, it: Item, act: string): Promise<string> {
  if (act === 'no') {
    if (['publishing', 'published'].includes(it.status)) return 'العنصر ده اتنشر خلاص.';
    await patchItem(it.id, { status: 'rejected', scheduled_at: null });
    return `❌ اترفض: ${it.topic}`;
  }
  if (act === 'retry' && it.status === 'failed') {
    await patchItem(it.id, { status: 'approved', scheduled_at: new Date().toISOString(), error: null, ig_container_id: null, ig_status: null, fb_status: null, publish_started_at: null });
    return `🔁 هحاول أنشره تاني خلال دقايق: ${it.topic}`;
  }
  if (act !== 'ok') return 'أمر مش معروف';
  if (it.status === 'idea') {
    await patchItem(it.id, { status: 'idea_approved' });
    return `✅ الفكرة اتوافق عليها، والسكريبت هيوصلك قريب: ${it.topic}`;
  }
  if (it.status === 'script_ready') {
    await patchItem(it.id, { status: 'script_approved' });
    return `✅ السكريبت اتوافق عليه، و${it.kind === 'reel' ? 'الفيديو' : 'التصميم'} هيوصلك للمراجعة: ${it.topic}`;
  }
  if (it.status === 'media_ready') {
    if (!it.media_url) return 'مفيش ملف مرفوع للعنصر ده لسه.';
    const at = await nextFreeSlot(it.kind, s);
    await patchItem(it.id, { status: 'approved', scheduled_at: at.toISOString() });
    return s.publisher === 'meta'
      ? `🗓️ اتجدول: ${kwTime(at.toISOString())}\n${it.topic}`
      : `✅ اتوافق عليه، وهيتجدول على Postora في: ${kwTime(at.toISOString())}\n${it.topic}`;
  }
  return `العنصر ده حالته دلوقتي: ${it.status}`;
}

// ---------------- publishing ----------------

async function igToken(): Promise<{ token: string; igUser: string } | null> {
  const { data: sec } = await supabase.from('ig_agent_secrets').select('access_token').eq('id', 1).maybeSingle();
  const { data: st } = await supabase.from('ig_agent_settings').select('ig_user_id').eq('id', 1).maybeSingle();
  const token = sec?.access_token || Deno.env.get('IG_ACCESS_TOKEN');
  return token && st?.ig_user_id ? { token, igUser: st.ig_user_id } : null;
}

async function graph(url: string, params: Record<string, string>, method = 'POST', headers: Record<string, string> = {}) {
  const u = new URL(url);
  const init: RequestInit = { method, headers };
  if (method === 'GET') for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  else init.body = new URLSearchParams(params);
  const res = await fetch(u, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) throw new Error(body.error?.error_user_msg || body.error?.message || `HTTP ${res.status}`);
  return body;
}

async function startInstagram(it: Item, auth: { token: string; igUser: string }) {
  const params: Record<string, string> = { caption: it.caption ?? '', access_token: auth.token };
  if (it.kind === 'reel') Object.assign(params, { media_type: 'REELS', video_url: it.media_url!, share_to_feed: 'true', ...(it.cover_url ? { cover_url: it.cover_url } : {}) });
  else params.image_url = it.media_url!;
  const r = await graph(`${IG_BASE}/${auth.igUser}/media`, params);
  return r.id as string;
}

async function publishFacebook(it: Item): Promise<string> {
  if (it.kind === 'image') {
    const r = await graph(`${FB_BASE}/${FB_PAGE_ID}/photos`, { url: it.media_url!, message: it.caption ?? '', access_token: FB_PAGE_TOKEN });
    return r.post_id || r.id;
  }
  // Reels: start an upload session, let Facebook fetch the file from its URL, then publish
  const start = await graph(`${FB_BASE}/${FB_PAGE_ID}/video_reels`, { upload_phase: 'start', access_token: FB_PAGE_TOKEN });
  const up = await fetch(start.upload_url, { method: 'POST', headers: { Authorization: `OAuth ${FB_PAGE_TOKEN}`, file_url: it.media_url! } });
  const upBody = await up.json().catch(() => ({}));
  if (!up.ok || !upBody.success) throw new Error(upBody.debug_info?.message || `upload HTTP ${up.status}`);
  await graph(`${FB_BASE}/${FB_PAGE_ID}/video_reels`, {
    upload_phase: 'finish', video_id: start.video_id, video_state: 'PUBLISHED', description: it.caption ?? '', access_token: FB_PAGE_TOKEN,
  });
  return start.video_id;
}

async function startPublish(s: Settings, it: Item) {
  const patch: Record<string, unknown> = { status: 'publishing', publish_started_at: new Date().toISOString(), error: null };
  const errors: string[] = [];
  // claim first so two ticks never publish the same item
  const { data: claimed } = await supabase.from('content_items').update({ status: 'publishing', updated_at: new Date().toISOString() })
    .eq('id', it.id).eq('status', 'approved').select('id');
  if (!claimed?.length) return;

  if (s.publish_instagram) {
    const auth = await igToken();
    if (!auth) { patch.ig_status = 'failed'; errors.push('Instagram: no token / account id'); }
    else {
      try { patch.ig_container_id = await startInstagram(it, auth); patch.ig_status = 'processing'; }
      catch (e) { patch.ig_status = 'failed'; errors.push(`Instagram: ${errMsg(e)}`); }
    }
  } else patch.ig_status = 'skipped';

  if (s.publish_facebook && FB_PAGE_ID && FB_PAGE_TOKEN) {
    try { patch.fb_post_id = await publishFacebook(it); patch.fb_status = 'done'; }
    catch (e) { patch.fb_status = 'failed'; errors.push(`Facebook: ${errMsg(e)}`); }
  } else patch.fb_status = 'skipped';

  if (errors.length) patch.error = errors.join(' | ');
  await patchItem(it.id, patch);
}

async function advance(s: Settings, it: Item) {
  if (it.ig_status === 'processing' && it.ig_container_id) {
    const auth = await igToken();
    try {
      if (!auth) throw new Error('no Instagram token');
      const st = await graph(`${IG_BASE}/${it.ig_container_id}`, { fields: 'status_code,status', access_token: auth.token }, 'GET');
      if (st.status_code === 'FINISHED') {
        const pub = await graph(`${IG_BASE}/${auth.igUser}/media_publish`, { creation_id: it.ig_container_id, access_token: auth.token });
        const m = await graph(`${IG_BASE}/${pub.id}`, { fields: 'permalink', access_token: auth.token }, 'GET').catch(() => ({}));
        Object.assign(it, { ig_status: 'done', ig_media_id: pub.id, ig_permalink: m.permalink ?? null });
      } else if (st.status_code === 'ERROR' || st.status_code === 'EXPIRED') {
        throw new Error(`processing ${st.status_code}: ${st.status ?? ''}`);
      } else if (Date.now() - Date.parse(it.publish_started_at ?? '') > IG_PROCESSING_TIMEOUT_MS) {
        throw new Error('processing took more than 45 minutes');
      } else return; // still processing: check again next tick
    } catch (e) {
      it.ig_status = 'failed';
      it.error = [it.error, `Instagram: ${errMsg(e)}`].filter(Boolean).join(' | ');
    }
  }
  const ok = it.ig_status === 'done' || it.fb_status === 'done';
  const status = ok ? 'published' : 'failed';
  await patchItem(it.id, {
    status, ig_status: it.ig_status, ig_media_id: it.ig_media_id, ig_permalink: it.ig_permalink, error: it.error,
    published_at: ok ? new Date().toISOString() : null,
  });
  if (ok) {
    const where = [it.ig_status === 'done' ? `📸 <a href="${esc(it.ig_permalink ?? '')}">انستجرام</a>` : '', it.fb_status === 'done' ? '📘 فيسبوك' : ''].filter(Boolean).join(' · ');
    await send(s, `✅ <b>اتنشر</b> · ${KIND_AR[it.kind]}\n${esc(it.topic)}\n${where}${it.error ? `\n⚠️ ${esc(it.error)}` : ''}`, it.id);
  } else {
    await send(s, `❌ <b>فشل النشر</b> · ${esc(it.topic)}\n${esc(it.error ?? '')}`, it.id,
      { reply_markup: { inline_keyboard: [[{ text: '🔁 حاول تاني', callback_data: `retry:${it.id}` }]] } });
  }
}

async function tick() {
  const s = await loadSettings();
  await ensureTelegramWebhook(s).catch((e) => console.error('content-studio: webhook', e));
  await flushQuestions(s).catch((e) => console.error('content-studio: questions', e));
  let started = 0;
  // with Postora the Claude session schedules approved items itself; this function only publishes in 'meta' mode
  if (s.publisher !== 'meta') return { publisher: s.publisher };
  if (!s.paused) {
    const { data: due } = await supabase.from('content_items').select('*').eq('status', 'approved')
      .lte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(3);
    for (const it of (due ?? []) as Item[]) { await startPublish(s, it); started++; }
  }
  const { data: running } = await supabase.from('content_items').select('*').eq('status', 'publishing');
  for (const it of (running ?? []) as Item[]) await advance(s, it).catch((e) => console.error('content-studio: advance', it.id, e));
  return { started, publishing: running?.length ?? 0 };
}

// ---------------- studio API (Claude sessions) ----------------

function pick(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => EDITABLE.includes(k)));
}

async function studioAction(body: any) {
  const s = await loadSettings();
  switch (body.action) {
    case 'settings':
      return { reel_slots: s.reel_slots, image_slots: s.image_slots, paused: s.paused, telegram: !!s.telegram_chat_id };
    case 'list': {
      let q = supabase.from('content_items').select('*').order('created_at', { ascending: true }).limit(Math.min(Number(body.limit) || 50, 200));
      if (body.status) q = q.in('status', [].concat(body.status));
      if (body.kind) q = q.eq('kind', body.kind);
      const { data, error } = await q;
      if (error) throw error;
      return { items: data };
    }
    case 'topics': {
      // everything ever proposed, so new ideas never repeat old ones
      const { data } = await supabase.from('content_items').select('kind, topic, status, created_at').order('created_at', { ascending: false }).limit(1000);
      return { topics: data };
    }
    case 'create': {
      const rows = [].concat(body.items ?? []).map((r: any) => ({ status: 'idea', ...pick(r) }));
      if (!rows.length) throw new Error('items required');
      const { data, error } = await supabase.from('content_items').insert(rows).select('*');
      if (error) throw error;
      for (const it of (data ?? []) as Item[]) if (NEEDS_OWNER.includes(it.status)) await notifyOwner(s, it);
      return { items: data };
    }
    case 'update': {
      if (!body.id) throw new Error('id required');
      const patch = pick(body.patch ?? {});
      if (patch.status && patch.status !== 'revise') Object.assign(patch, { feedback: null, revise_from: null });
      await patchItem(body.id, patch);
      const it = await getItem(body.id);
      if (it && patch.status && NEEDS_OWNER.includes(it.status)) await notifyOwner(s, it);
      if (it && patch.status === 'scheduled') {
        await send(s, `📅 <b>اتجدول على Postora</b> · ${KIND_AR[it.kind]}\n${esc(it.topic)}\n🕘 ${kwTime(it.scheduled_at)}${it.platforms?.length ? `\n📲 ${esc(it.platforms.join(' · '))}` : ''}`, it.id);
      }
      return { item: it };
    }
    case 'upload_url': {
      // signed URL the studio session PUTs the file to; the public URL is what Instagram and Facebook fetch
      const path = String(body.path ?? '').replace(/^\/+/, '');
      if (!path || path.includes('..')) throw new Error('path required');
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true });
      if (error) throw error;
      return { signed_url: data.signedUrl, public_url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
    }
    case 'tts': {
      // voice-over for a script: generated with Gemini, stored in the bucket, sent to the owner to approve
      if (!body.script) throw new Error('script required');
      const { data, error } = await supabase.from('content_voices').insert({
        item_id: body.item_id ?? null, title: body.title ?? null, script: body.script, voice_description: body.voice_description ?? null,
        voice: body.voice || 'Achird',
      }).select('*').single();
      if (error) throw error;
      return await makeVoice(s, data as Voice);
    }
    case 'voice':
      return { voice: (await supabase.from('content_voices').select('id, status, take, url, duration_sec, error').eq('id', body.id).maybeSingle()).data };
    case 'notify':
      await send(s, String(body.text ?? ''), null);
      return { ok: true };
    default:
      throw new Error(`Unknown action: ${body.action}`);
  }
}

async function timingSafeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text();
    const tgSecret = req.headers.get('x-telegram-bot-api-secret-token');
    if (tgSecret) {
      if (!BOT_TOKEN || tgSecret !== (await webhookSecret())) return new Response('Forbidden', { status: 403 });
      EdgeRuntime.waitUntil(handleTelegram(JSON.parse(raw)).catch((e) => console.error('content-studio: telegram update failed', e)));
      return new Response('ok');
    }
    const body = raw ? JSON.parse(raw) : {};
    if (body.action === 'tick') return json(await tick());
    // sends only rows already queued in the database, to the owner's chat: safe without the studio token
    if (body.action === 'flush') return json(await flushQuestions(await loadSettings()));
    const token = req.headers.get('x-studio-token') ?? '';
    if (!STUDIO_TOKEN || !(await timingSafeEqual(token, STUDIO_TOKEN))) return json({ error: 'Unauthorized' }, 401);
    return json(await studioAction(body));
  } catch (e) {
    console.error('content-studio error:', e);
    return json({ error: errMsg(e) }, 500);
  }
});
