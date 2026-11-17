// Products this visitor looked at recently (this browser only)
const KEY = 'ql-recently-viewed';
const MAX = 16;

export function rememberViewed(productId: string) {
  try {
    const list = getViewed().filter((id) => id !== productId);
    list.unshift(productId);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch { /* storage unavailable */ }
}

export function getViewed(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
