// ---------- Magnetic track in a lounge (maglounge 3D body): product hero, 17 s ----------
const L = { hook: .35, noel: 2.19, track: 3.94, click: 5.56, slide: 6.86, spot: 8.98, lin: 9.97, pend: 10.6, same: 11.9, cta: 13.81, wa: 15.75, end: 17.4 };
function seq(keys, times, t, d, z, cx, cy) { let i = 0; while (i + 1 < keys.length && t >= times[i + 1]) i++; if (i === 0) { bgImg(IM[keys[0]], 1, z, cx, cy); return; } xfade(keys[i - 1], keys[i], t, times[i], d, z, cx, cy); }
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const KEYS = ['w_n-0-room', 'c_n-1-on-room', 'c_n-2-on-room', 'c_n-3-on-room', 'c_n-3-on-slide-0-room', 'c_n-3-on-slide-0.5-room', 'w_n-3-on-room', 'w_n-3-on-linear-room', 'w_n-3-on-linear-pend-room'];
const DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function S1(t) { // want to move the light… without an electrician?
  bgImg(IM['w_n-0-room'], 1, 1.04 + .05 * prog(t, 0, L.track), 540, 960); shade2();
  pop('تبي تغيّر مكان الضو؟ 💡', 540, 330, t, L.hook, 0, { size: 76, weight: 900, color: '#fff', glow: 25 });
  pop('…بدون كهربائي؟ 🤔', 540, 1600, t, L.noel, 0, { size: 84, weight: 900, color: C.o2, glow: 30 });
}
function S2(t) { // the magnetic track: click the head on… and slide it wherever you want
  const z = 1.05 + .05 * prog(t, L.track, L.spot);
  if (t < L.slide) seq(['c_n-1-on-room', 'c_n-2-on-room', 'c_n-3-on-room'], [L.track - 1, L.click, L.click + .5], t, .25, z, 540, 900);
  else seq(['c_n-3-on-slide-0-room', 'c_n-3-on-slide-0.5-room', 'c_n-3-on-room'], [L.slide - 1, L.slide + .5, L.slide + 1.0], t, .45, z, 540, 900);
  shade2();
  title2('التراك المغناطيسي 🧲', t, L.track, 0, C.o2, 66);
  chipAt('🧲 تلزق الكشاف… كليك', 1520, t, L.click);
  chipAt('↔️ وتسحبه وين ما تبي', 1650, t, L.slide, GOOD, '#06210f');
}
function S3(t) { // spot, linear, pendant… all on the same track
  seq(['w_n-3-on-room', 'w_n-3-on-linear-room', 'w_n-3-on-linear-pend-room'], [L.spot - 1, L.lin, L.pend], t, .35, 1.04 + .05 * prog(t, L.spot, L.cta), 540, 900);
  shade2();
  [['🔦 سبوت', L.spot], ['➖ خطي', L.lin], ['💡 معلّق', L.pend]].forEach(([s, t0], i) => label(s, 540, 1340 + i * 120, t, t0, 0, { size: 56, bg: DARK, color: '#fff' }));
  label('كلهم على نفس المجرى ✓', 540, 330, t, L.same, 0, { size: 60, bg: GOOD, color: '#06210f' });
}
function S4(t) { // come see it at the showroom
  bgImg(IM['w_n-3-on-linear-pend-room'], 1, 1.1, 540, 900); dim(.55);
  pop('تعال جرّبه بيدك 👋', 540, 360, t, L.cta, 0, { size: 76, weight: 900, color: '#fff', glow: 25 });
  pop('بالمعرض – حولي، شارع تونس', 540, 480, t, L.cta + .4, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const lp = prog(t, L.cta + .2, L.cta + .6); glow(540, 800, 210, C.o, .4 * lp); drawImg(LOGO3D, 540, 790, 220 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 940, 260, { alpha: prog(t, L.cta + .4, L.cta + .9) });
  const q = E.back(prog(t, L.wa - .1, L.wa + .25)); if (q > 0) { ctx.save(); ctx.translate(540, 1180); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  txt('@quality_light1', 540, 1330, { size: 46, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.wa + .3, L.wa + .7) });
}
const SCENES = [[0, L.track, S1], [L.track, L.spot, S2], [L.spot, L.cta, S3], [L.cta, L.end, S4]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 2.5 && t < L.cta - .2) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  endFrame(t);
  if (t > L.end - .5) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (L.end - .5)) / .5)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of KEYS) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
