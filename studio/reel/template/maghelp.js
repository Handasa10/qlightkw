
// ---------- magnetic-track helpers ----------
const TRK = '#141215';
function track(x0, x1, y, o = {}) { // slim magnetic rail (front view)
  const a = o.a ?? 1, w = o.w ?? 18; if (a <= 0 || x1 <= x0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = TRK; rrect(x0, y - w / 2, x1 - x0, w, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 4, y - w / 2 + 2); ctx.lineTo(x1 - 4, y - w / 2 + 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.moveTo(x0 + 4, y + 2); ctx.lineTo(x1 - 4, y + 2); ctx.stroke();
  ctx.restore();
}
function ceiling(y, a = 1) { // ceiling slab
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, y - 120, 0, y); g.addColorStop(0, '#2a2629'); g.addColorStop(1, '#3a353a');
  ctx.fillStyle = g; ctx.fillRect(0, y - 120, W, 120);
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, y - 2, W, 2);
  ctx.restore();
}
function cone(x, y, len, hw, a, col = [255, 222, 180], ang = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, 0, 0, len); g.addColorStop(0, `rgba(${col},${.55 * a})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.lineTo(hw, len); ctx.lineTo(-hw, len); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function spotMod(x, y, on, o = {}) { // cylinder spot hanging from track
  const a = o.a ?? 1, ang = o.ang ?? 0, s = o.s ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (on > 0) cone(0, 70, o.len ?? 420, o.hw ?? 120, on, undefined, ang);
  ctx.fillStyle = '#1d1a1e'; ctx.fillRect(-14, 0, 28, 14);
  ctx.save(); ctx.rotate(ang);
  const g = ctx.createLinearGradient(-26, 0, 26, 0); g.addColorStop(0, '#0e0d0f'); g.addColorStop(.5, '#3a363b'); g.addColorStop(1, '#0e0d0f');
  ctx.fillStyle = g; rrect(-24, 12, 48, 60, 6); ctx.fill();
  ctx.fillStyle = '#c9a063'; ctx.fillRect(-24, 60, 48, 4);
  if (on > 0) { glow(0, 72, 46, '#FFF1DC', on); ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.ellipse(0, 72, 16, 5, 0, 0, 7); ctx.fill(); }
  ctx.restore(); ctx.restore();
}
function linearMod(x0, x1, y, on, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y + 16, 0, y + 380); g.addColorStop(0, `rgba(255,226,190,${.5 * on})`); g.addColorStop(1, 'rgba(255,226,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, y + 16); ctx.lineTo(x1, y + 16); ctx.lineTo(x1 + 110, y + 380); ctx.lineTo(x0 - 110, y + 380); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#1d1a1e'; rrect(x0, y - 2, x1 - x0, 22, 4); ctx.fill();
  ctx.fillStyle = on > 0 ? '#fff4e2' : '#5a555b'; ctx.fillRect(x0 + 6, y + 12, x1 - x0 - 12, 8);
  if (on > 0) { ctx.save(); ctx.shadowColor = '#FFD6A0'; ctx.shadowBlur = 30; ctx.fillRect(x0 + 6, y + 12, x1 - x0 - 12, 8); ctx.restore(); }
  ctx.restore();
}
function grilleMod(x, y, on, n = 5, a = 1) {
  if (a <= 0) return;
  const cw = 40, w = n * cw;
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i++) if (on > 0) cone(x - w / 2 + cw / 2 + i * cw, y + 34, 360, 40, on * .5);
  ctx.fillStyle = '#1d1a1e'; rrect(x - w / 2, y - 2, w, 36, 4); ctx.fill();
  for (let i = 0; i < n; i++) { const cx = x - w / 2 + cw / 2 + i * cw; ctx.fillStyle = '#0b0a0c'; ctx.fillRect(cx - 14, y + 6, 28, 24); if (on > 0) { glow(cx, y + 28, 18, '#FFF1DC', on); ctx.fillStyle = '#fff6e6'; ctx.fillRect(cx - 8, y + 24, 16, 5); } }
  ctx.restore();
}
function pendantMod(x, y, len, on, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = '#2a262b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x, y + len); ctx.stroke();
  ctx.fillStyle = '#1d1a1e'; ctx.fillRect(x - 12, y, 24, 12);
  const g = ctx.createLinearGradient(x - 50, 0, x + 50, 0); g.addColorStop(0, '#8d6a35'); g.addColorStop(.5, '#e6c487'); g.addColorStop(1, '#8d6a35');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 12, y + len); ctx.lineTo(x + 12, y + len); ctx.lineTo(x + 52, y + len + 60); ctx.lineTo(x - 52, y + len + 60); ctx.closePath(); ctx.fill();
  if (on > 0) { cone(x, y + len + 60, 300, 140, on * .8); glow(x, y + len + 62, 60, '#FFF1DC', on); }
  ctx.restore();
}
function magnetFx(x, y, t, t0) { // field arcs at snap moment
  const p = prog(t, t0, t0 + .6); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha *= (1 - p); ctx.strokeStyle = C.o2; ctx.lineWidth = 3;
  for (let k = 0; k < 3; k++) { const r = 20 + k * 16 + p * 40; ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
  ctx.restore();
  glow(x, y, 70, C.amber, .7 * (1 - p));
}
function snapY(t, t0, yTarget) { const p = prog(t, t0, t0 + .35); return yTarget - (1 - E.back(p)) * 140 * (p < 1 ? 1 : 0) - (p <= 0 ? 999 : 0); }
const MI = {
  sofa: IC.sofa, house: IC.house,
  kitchen: ['M10 40 L90 40 L90 90 L10 90 Z', 'M10 55 L90 55', 'M30 40 L30 20 M70 40 L70 20', 'M20 70 L40 70 M60 70 L80 70'],
  corridor: ['M30 10 L70 10 L90 90 L10 90 Z', 'M50 10 L50 90', 'M40 30 L60 30 M36 55 L64 55'],
  dining: ['M15 45 L85 45', 'M25 45 L25 80 M75 45 L75 80', 'M50 10 L50 30', 'M35 30 L65 30 L60 40 L40 40 Z'],
  office: ['M10 55 L90 55', 'M20 55 L20 90 M80 55 L80 90', 'M35 20 L65 20 L65 45 L35 45 Z', 'M50 45 L50 55'],
  shop: ['M10 35 L90 35 L82 15 L18 15 Z', 'M15 35 L15 90 L85 90 L85 35', 'M40 90 L40 60 L60 60 L60 90'],
  phone: IC.phone, bolt: ['M55 5 L25 55 L48 55 L40 95 L75 40 L52 40 Z'],
  box: ['M15 30 L85 30 L85 75 L15 75 Z', 'M25 45 L45 45 M25 58 L60 58', 'M70 40 L78 40'],
  tag: ['M10 50 L50 10 L90 10 L90 50 L50 90 Z', 'M72 28 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0'],
  ceilingIc: ['M5 30 L95 30', 'M5 30 L5 15 M95 30 L95 15', 'M40 30 L40 40 L60 40 L60 30'],
  wrench: ['M70 15 C55 10 45 25 50 38 L15 73 L27 85 L62 50 C75 55 90 45 85 30 L72 40 L62 30 Z'],
  dimmer: ['M14 14 L86 14 L86 86 L14 86 Z', 'M50 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0', 'M50 50 L38 36'],
};

