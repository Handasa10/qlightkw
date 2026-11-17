// ---------- LED strip: bare vs aluminium profile + opal cover, and COB (stripprof 3D body), 23 s ----------
const L = { hook: .23, why: 1.33, prof: 4.32, parts: 6.16, cool: 8.34, bare: 10.8, dots: 12.15, heat: 13.35, smooth: 15.84, cob: 18.31, cta: 20.18, wa: 21.31, end: 23.1 };
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const KEYS = ['w_off', 'w_on', 'l_on', 'l_on-age-1', 'r_on', 'l_on-cob', 'd_on'];
const BAD = 'rgba(160,30,25,.92)', DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function S1(t) { // same strip… why one shows dots and the other is smooth?
  if (t < .5) bgImg(IM.w_off, 1, 1.05, 540, 960); else xfade('w_off', 'w_on', t, .5, .4, 1.05 + .05 * prog(t, .5, L.prof), 540, 960);
  shade2();
  pop('نفس الشريط… 💡', 540, 330, t, L.hook, 0, { size: 80, weight: 900, color: '#fff', glow: 25 });
  label('نقاط 😕', 300, 1300, t, L.why + .6, 0, { size: 54, bg: BAD, color: '#fff' });
  label('ناعم ✨', 790, 1300, t, L.why + 1.3, 0, { size: 54, bg: GOOD, color: '#06210f' });
}
function S2(t) { // the difference is the profile: aluminium channel + white cover, spreads the light and cools the strip
  if (t < L.parts) bgImg(IM.r_on, 1, 1.05 + .04 * prog(t, L.prof, L.parts), 540, 960); else xfade('r_on', 'd_on', t, L.parts, .45, 1.04 + .05 * prog(t, L.parts, L.bare), 540, 960);
  shade2();
  title2('الفرق بالبروفايل ✓', t, L.prof, 0, C.o2, 66);
  chipAt('🔩 قناة ألمنيوم + غطاء أبيض', 1480, t, L.parts);
  chipAt('✨ يوزّع الضو… ❄️ ويبرّد الشريط', 1620, t, L.cool, GOOD, '#06210f');
}
function S3(t) { // without a profile: dots on the wall, and heat yellows it fast
  if (t < L.heat) bgImg(IM.l_on, 1, 1.05 + .04 * prog(t, L.bare, L.heat), 540, 960); else xfade('l_on', 'l_on-age-1', t, L.heat, .6, 1.05 + .05 * prog(t, L.heat, L.smooth), 540, 960);
  shade2();
  title2('بدون بروفايل؟ ❌', t, L.bare, 0, '#ff8a80', 66);
  chipAt('نقاط بالجدار 😕', 1480, t, L.dots, BAD);
  chipAt('🔥 والحرارة تصفّره بسرعة', 1620, t, L.heat, BAD);
}
function S4(t) { // want a smooth line with no dots at all? COB strip
  xfade('l_on', 'l_on-cob', t, L.cob - .1, .5, 1.05 + .04 * prog(t, L.smooth, L.cta), 540, 960); shade2();
  title2('تبي خط ناعم بدون نقاط أبد؟', t, L.smooth, 0, C.o2, 58);
  const p = E.back(prog(t, L.cob, L.cob + .4)); if (p > 0) { ctx.save(); ctx.translate(540, 1500); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 40; rrect(-260, -80, 520, 160, 40); ctx.fill(); ctx.shadowBlur = 0; txt('شريط COB', 0, 6, { size: 80, weight: 900, color: '#fff' }); ctx.restore(); }
}
function S5(t) { // visit / WhatsApp
  bgImg(IM.w_on, 1, 1.1, 540, 960); dim(.55);
  pop('زورنا بحولي 📍', 540, 380, t, L.cta, 0, { size: 80, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 500, t, L.cta + .3, 0, { size: 48, weight: 800, color: '#f3dcc0' });
  const lp = prog(t, L.cta + .2, L.cta + .6); glow(540, 800, 210, C.o, .4 * lp); drawImg(LOGO3D, 540, 790, 220 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 940, 260, { alpha: prog(t, L.cta + .4, L.cta + .9) });
  const q = E.back(prog(t, L.wa - .1, L.wa + .25)); if (q > 0) { ctx.save(); ctx.translate(540, 1180); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  txt('@quality_light1', 540, 1330, { size: 46, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.wa + .3, L.wa + .7) });
}
const SCENES = [[0, L.prof, S1], [L.prof, L.bare, S2], [L.bare, L.smooth, S3], [L.smooth, L.cta, S4], [L.cta, L.end, S5]];
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
