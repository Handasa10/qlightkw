// ---------- Kuwaiti diwaniya, layer by layer (diwan 3D body): satisfying switch-on, no voice; one click per layer ----------
const L = { cove: 2.0, spots: 4.5, chand: 7.0, ent: 9.5, close: 11.3, ql: 12.6, end: 15.2 };
function seq(keys, t, t0, t1, z, cx, cy) { const n = keys.length - 1, f = clamp((t - t0) / (t1 - t0)) * n, k = Math.min(n, Math.floor(f)), fr = f - k; bgImg(IM[keys[k]], 1, z, cx, cy); if (k < n && fr > 0) bgImg(IM[keys[k + 1]], E.inOut(fr), z, cx, cy); }
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = 'brightness(1.06) contrast(1.04)'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['w_off', 'w_cove-0.5', 'w_cove', 'w_cove-spots-0.5', 'w_cove-spots', 'w_cove-spots-chand-0.5', 'w_cove-spots-chand', 'w_all', 'c_all', 's_all'];
function word(s, t, t0, col = '#fff') { pop(s, 540, 300, t, t0 + .05, 0, { size: 74, weight: 900, color: col, glow: 30 }); }
function S1(t) { // the dark diwaniya, then each layer on a click
  const z = 1.02 + .06 * prog(t, 0, L.close);
  if (t < L.cove) bgImg(IM.w_off, 1, z, 540, 960);
  else if (t < L.spots) seq(['w_off', 'w_cove-0.5', 'w_cove'], t, L.cove, L.cove + .7, z, 540, 960);
  else if (t < L.chand) seq(['w_cove', 'w_cove-spots-0.5', 'w_cove-spots'], t, L.spots, L.spots + .6, z, 540, 960);
  else if (t < L.ent) seq(['w_cove-spots', 'w_cove-spots-chand-0.5', 'w_cove-spots-chand'], t, L.chand, L.chand + .6, z, 540, 960);
  else xfade('w_cove-spots-chand', 'w_all', t, L.ent, .15, z, 540, 960);
  shade2();
  if (t < L.cove) word('الديوانية 🌙', t, 0);
  else if (t < L.spots) word('مخفي ✨', t, L.cove);
  else if (t < L.chand) word('سبوتات', t, L.spots);
  else if (t < L.ent) word('ثريا ✨', t, L.chand);
  else word('المدخل', t, L.ent);
}
function S2(t) { // the chandelier and the seating, then the sign-off
  if (t < L.close + .8) bgImg(IM.c_all, 1, 1.03 + .05 * prog(t, L.close, L.close + .8), 540, 900);
  else xfade('c_all', 's_all', t, L.close + .8, .5, 1.03 + .05 * prog(t, L.close + .8, L.end), 540, 900);
  shade2();
  if (t >= L.ql) dim(.5 * prog(t, L.ql, L.ql + .5));
  const lp = prog(t, L.ql, L.ql + .4); if (lp > 0) { glow(540, 820, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 820, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 980, 270, { alpha: prog(t, L.ql + .3, L.ql + .8) }); }
  const q = E.back(prog(t, L.ql + .6, L.ql + 1.0)); if (q > 0) { ctx.save(); ctx.translate(540, 1180); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  if (t >= L.ql + 1.0) txt('@quality_light1', 540, 1330, { size: 46, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.ql + 1.0, L.ql + 1.4) });
  if (t < L.ql) word('ديوانيتك تستاهل ✨', t, L.close, '#fff');
}
const SCENES = [[0, L.close, S1], [L.close, L.end, S2]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  endFrame(t);
  if (t > L.end - .6) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (L.end - .6)) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of KEYS) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
