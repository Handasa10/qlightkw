// Instagram API with Instagram Login (graph.instagram.com) helpers.
// Permissions needed: instagram_business_basic, instagram_business_manage_comments.

const IG_API_VERSION = Deno.env.get('IG_API_VERSION') || 'v23.0';
const IG_BASE = `https://graph.instagram.com/${IG_API_VERSION}`;

export interface IgMedia {
  id: string;
  caption?: string;
  permalink?: string;
  media_product_type?: string;
  timestamp?: string;
  comments_count?: number;
}

export interface IgComment {
  id: string;
  text?: string;
  timestamp?: string;
  username?: string;
  from?: { id: string; username?: string };
  parent_id?: string;
  replies?: { data: IgComment[] };
}

async function igGet<T>(path: string, token: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${IG_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('access_token', token);
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`Instagram GET ${path}: ${JSON.stringify(body.error ?? body)}`);
  return body as T;
}

export function getMe(token: string) {
  // user_id is the professional account id used in webhooks; id is app-scoped
  return igGet<{ id: string; user_id?: string; username?: string }>('me', token, { fields: 'id,user_id,username' });
}

export async function getRecentMedia(token: string, limit = 8) {
  const r = await igGet<{ data: IgMedia[] }>('me/media', token, {
    fields: 'id,caption,permalink,media_product_type,timestamp',
    limit: String(limit),
  });
  return r.data ?? [];
}

const COMMENT_FIELDS = 'id,text,timestamp,username,from,replies{id,text,timestamp,username,from}';

// One call for the latest posts and their comments (field expansion), so the poll stays cheap
export async function getRecentMediaWithComments(token: string, limit = 20) {
  const r = await igGet<{ data: (IgMedia & { comments?: { data: IgComment[] } })[] }>('me/media', token, {
    fields: `id,caption,permalink,media_product_type,timestamp,comments_count,comments.limit(50){${COMMENT_FIELDS}}`,
    limit: String(limit),
  });
  return (r.data ?? []).map((m) => ({ media: m, comments: m.comments?.data ?? [] }));
}

// One page of older posts with their first comments, for reviewing the back catalogue
export async function getMediaPage(token: string, after: string | null, limit = 8) {
  const params: Record<string, string> = {
    fields: `id,caption,permalink,media_product_type,timestamp,comments_count,comments.limit(50){${COMMENT_FIELDS}}`,
    limit: String(limit),
  };
  if (after) params.after = after;
  const r = await igGet<{ data: (IgMedia & { comments?: { data: IgComment[] } })[]; paging?: { cursors?: { after?: string }; next?: string } }>('me/media', token, params);
  return {
    posts: (r.data ?? []).map((m) => ({ media: m, comments: m.comments?.data ?? [] })),
    next: r.paging?.next ? r.paging.cursors?.after ?? null : null,
  };
}

// Every comment on a post (follows paging), capped so one viral post cannot eat a whole run
export async function getAllMediaComments(mediaId: string, token: string, maxPages = 6) {
  const all: IgComment[] = [];
  let after: string | undefined;
  for (let i = 0; i < maxPages; i++) {
    const params: Record<string, string> = { fields: COMMENT_FIELDS, limit: '50' };
    if (after) params.after = after;
    const r = await igGet<{ data: IgComment[]; paging?: { cursors?: { after?: string }; next?: string } }>(`${mediaId}/comments`, token, params);
    all.push(...(r.data ?? []));
    if (!r.paging?.next) break;
    after = r.paging.cursors?.after;
  }
  return all;
}

export function getMedia(mediaId: string, token: string) {
  return igGet<IgMedia>(mediaId, token, { fields: 'id,caption,permalink,media_product_type,timestamp' });
}

export async function getMediaComments(mediaId: string, token: string) {
  const r = await igGet<{ data: IgComment[] }>(`${mediaId}/comments`, token, {
    fields: COMMENT_FIELDS,
    limit: '50',
  });
  return r.data ?? [];
}

export function getComment(commentId: string, token: string) {
  return igGet<IgComment>(commentId, token, { fields: 'id,text,username,timestamp' });
}

// Instagram threads are one level deep: replies always attach to the top-level comment
export async function replyToComment(topLevelCommentId: string, message: string, token: string) {
  const res = await fetch(`${IG_BASE}/${topLevelCommentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ message, access_token: token }),
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`Instagram reply: ${JSON.stringify(body.error ?? body)}`);
  return body as { id: string };
}

// Long-lived tokens last 60 days; refreshing (allowed once the token is 24h old) extends them
export async function refreshToken(token: string) {
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', token);
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`Instagram token refresh: ${JSON.stringify(body.error ?? body)}`);
  return body as { access_token: string; expires_in: number };
}

// Verify X-Hub-Signature-256 (HMAC-SHA256 of the raw body with the Instagram app secret)
export async function verifySignature(rawBody: string, header: string | null, appSecret: string) {
  if (!header?.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(appSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)));
  const hex = Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join('');
  const given = header.slice(7);
  if (given.length !== hex.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
