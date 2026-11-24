// Telegram bot for following the Instagram agent: every reply is reported, comments that need the
// owner arrive with buttons, and replying to a bot message posts that text on Instagram.

const BOT_TOKEN = Deno.env.get('IG_TELEGRAM_BOT_TOKEN') || '';

export const telegramEnabled = () => !!BOT_TOKEN;

export interface TgComment {
  comment_id: string;
  username?: string | null;
  text?: string | null;
  category?: string | null;
  draft_reply?: string | null;
  media_permalink?: string | null;
  media_caption?: string | null;
}

export async function tg<T = any>(method: string, payload: Record<string, unknown>): Promise<T> {
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
export async function webhookSecret() {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ig-agent:${BOT_TOKEN}`)));
  return Array.from(hash.slice(0, 24), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const esc = (s?: string | null) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CATEGORY_AR: Record<string, string> = {
  technical_question: 'سؤال فني',
  price_question: 'سؤال سعر',
  location_contact: 'مكان / تواصل',
  praise: 'مديح',
  friend_tag: 'منشن',
  complaint: 'شكوى',
  spam: 'سبام',
  other: 'أخرى',
};

function header(c: TgComment) {
  const post = c.media_permalink
    ? `🔗 <a href="${esc(c.media_permalink)}">البوست</a>${c.media_caption ? ` · ${esc(c.media_caption.slice(0, 60))}` : ''}`
    : '';
  return `👤 <b>@${esc(c.username ?? '—')}</b> · ${CATEGORY_AR[c.category ?? ''] ?? esc(c.category ?? '')}\n💬 ${esc(c.text)}\n${post}`;
}

export function repliedMessage(c: TgComment, reply: string) {
  return `✅ <b>رد الوكيل</b>\n${header(c)}\n\n↩️ ${esc(reply)}\n\n<i>تقدر تعمل Reply على الرسالة دي وتكتب رد إضافي، وهينزل على الإنستجرام.</i>`;
}

export function reviewMessage(c: TgComment) {
  return `⚠️ <b>محتاج تدخلك</b>\n${header(c)}\n\n📝 اقتراح الوكيل: ${esc(c.draft_reply || '—')}\n\n<i>اختار من الأزرار، أو اعمل Reply على الرسالة دي واكتب ردك وهينزل على الإنستجرام.</i>`;
}

export function reviewButtons(c: TgComment) {
  const row = [{ text: '🚫 تجاهل', callback_data: `no:${c.comment_id}` }];
  if (c.draft_reply?.trim()) row.unshift({ text: '✅ انشر الاقتراح', callback_data: `ok:${c.comment_id}` });
  return { inline_keyboard: [row] };
}

export const HELP = `أهلًا 👋 ده بوت متابعة وكيل إنستجرام كواليتي لايت.

• كل رد الوكيل ينشره هيوصلك هنا.
• الكومنتات اللي محتاجة تدخلك هتوصلك بأزرار.
• اعمل Reply على أي رسالة واكتب ردك، وهينزل على الإنستجرام تحت نفس الكومنت.

الأوامر:
/status ملخص اليوم
/pending الكومنتات اللي مستنياك
/pause إيقاف الوكيل
/resume تشغيل الوكيل`;
