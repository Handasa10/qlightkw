// ---------- Project of the week (villaproj 3D body): open site → the plan on the floor → cables + drivers before the gypsum → gypsum closed → the villa lights up room by room → hall / kitchen / entrance → designers: from the lighting plan to supply → CTA ----------
const L = {
  hook: .21, open: 1.51, lit: 2.96,
  plan: 4.86, map: 5.7, spot: 7.13, hid: 7.6, sconce: 8.6,
  wire: 10.7, drv: 12.0, before: 13.83,
  now: 15.61, closed: 16.58, rooms: 17.72,
  hall: 20.51, kit: 21.7, ent: 23.42,
  des: 25.6, work: 27.85, supply: 30.19,
  cta: 31.58, tun: 32.78, opp: 33.78, wa: 35.43, sign: 36.78, end: 39.7,
};
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function seq(keys, times, t, d, z, cx, cy) { let i = 0; while (i + 1 < keys.length && t >= times[i + 1]) i++; if (i === 0) { bgImg(IM[keys[0]], 1, z, cx, cy); return; } xfade(keys[i - 1], keys[i], t, times[i], d, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = a[0] === IM.c_done ? 'brightness(2.3) contrast(1.05)' : 'brightness(1.08) contrast(1.04)'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['t_site-top', 't_site-plan-top', 'c_site-wire', 't_site-wire-top', 'c_done', 'c_done-lit-1', 't_done-top-dim-0.6', 't_done-top-lit-0.35-dim-0.6', 't_done-top-lit-0.7-dim-0.6', 't_done-top-lit-1-dim-0.6', 'h_done-lit-1', 'k_done-lit-1', 'e_done-lit-1', 'h_done'];
const DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function step(n, s, t, t0, col = C.o) { // numbered step badge + title at the top
  const p = E.back(prog(t, t0, t0 + .35)); if (p <= 0) return;
  ctx.save(); ctx.translate(540, 300); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(18,14,12,.88)'; rrect(-380, -62, 760, 124, 62); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(318, 0, 46, 0, 7); ctx.fill();
  txt(n, 318, 5, { size: 58, weight: 900, color: '#fff', dir: 'ltr' });
  txt(s, -40, 4, { size: 54, weight: 900, color: '#fff' });
  ctx.restore();
}
function S1(t) { // a villa: from an open ceiling until it lit up
  if (t < L.lit) bgImg(IM['t_site-top'], 1, 1.06 - .03 * prog(t, 0, L.lit), 540, 960);
  else xfade('t_site-top', 't_done-top-lit-1-dim-0.6', t, L.lit, .5, 1.03 + .03 * prog(t, L.lit, L.plan), 540, 960);
  shade2();
  label('مشروع الأسبوع 🏗️', 540, 220, t, L.hook, 0, { size: 56, bg: C.o, color: '#fff' });
  pop('من سقف مفتوح…', 540, 380, t, L.open, 0, { size: 84, weight: 900, color: '#fff', glow: 25 });
  pop('لين ما ولّعت ✨', 540, 1620, t, L.lit, 0, { size: 84, weight: 900, color: C.o2, glow: 30 });
}
function S2(t) { // first we draw the plan: where the spots go, the hidden light, the wall lights
  xfade('t_site-top', 't_site-plan-top', t, L.map - .3, .6, 1.04 + .04 * prog(t, L.plan, L.wire), 540, 960); shade2();
  step('1', 'نرسم المخطط 📐', t, L.plan);
  chipAt('🎯 وين السبوت', 1400, t, L.spot, 'rgba(255,122,26,.92)');
  chipAt('✨ وين المخفي', 1530, t, L.hid, 'rgba(255,179,71,.95)', '#1a1416');
  chipAt('🔆 وين الأباليك', 1660, t, L.sconce, 'rgba(255,211,77,.95)', '#1a1416');
}
function S3(t) { // then cables and drivers, before the gypsum is closed
  if (t < L.drv) bgImg(IM['c_site-wire'], 1, 1.04 + .04 * prog(t, L.wire, L.drv), 540, 900);
  else xfade('c_site-wire', 't_site-wire-top', t, L.drv, .5, 1.04 + .04 * prog(t, L.drv, L.now), 540, 960);
  shade2();
  step('2', 'الأسلاك والدرايفرات 🔌', t, L.wire);
  chipAt('⏳ قبل لا يتسكّر الجبس', 1600, t, L.before, 'rgba(160,30,25,.92)');
}
function S4(t) { // now the gypsum is closed, and the villa lights up room by room
  if (t < L.rooms) xfade('c_site-wire', 'c_done', t, L.closed - .2, .5, 1.04 + .03 * prog(t, L.now, L.rooms), 540, 900);
  else seq(['c_done', 't_done-top-dim-0.6', 't_done-top-lit-0.35-dim-0.6', 't_done-top-lit-0.7-dim-0.6', 't_done-top-lit-1-dim-0.6'], [L.rooms - 1, L.rooms, L.rooms + .7, L.rooms + 1.4, L.rooms + 2.1], t, .45, 1.03 + .04 * prog(t, L.rooms, L.hall), 540, 960);
  shade2();
  step('3', 'الجبس تسكّر ✅', t, L.now, GOOD);
  if (t > L.rooms) pop('غرفة… غرفة 💡', 540, 1620, t, L.rooms + .2, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
}
function S5(t) { // a warm hall, a clear kitchen, an entrance that welcomes you
  if (t < L.kit) bgImg(IM['h_done-lit-1'], 1, 1.04 + .04 * prog(t, L.hall, L.kit), 540, 960);
  else if (t < L.ent) xfade('h_done-lit-1', 'k_done-lit-1', t, L.kit - .1, .4, 1.04 + .04 * prog(t, L.kit, L.ent), 540, 960);
  else xfade('k_done-lit-1', 'e_done-lit-1', t, L.ent - .1, .4, 1.04 + .04 * prog(t, L.ent, L.des), 540, 960);
  shade2();
  const s = t < L.kit ? ['صالة دافية 🛋️', L.hall] : t < L.ent ? ['مطبخ واضح 🍳', L.kit] : ['مدخل يرحّب فيك 🚪', L.ent];
  label(s[0], 540, 1600, t, s[1], 0, { size: 66, bg: DARK, color: C.o2 });
}
function S6(t) { // designer or decor office? we work with you from the lighting plan to supply
  bgImg(IM['t_done-top-lit-1-dim-0.6'], 1, 1.08 + .04 * prog(t, L.des, L.cta), 540, 960); dim(.45);
  const lp = prog(t, L.des + .1, L.des + .5); glow(540, 760, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 740, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 910, 290, { alpha: prog(t, L.des + .3, L.des + .8) });
  pop('مصمم أو مكتب ديكور؟ 🎨', 540, 360, t, L.des, 0, { size: 74, weight: 900, color: '#fff', glow: 25 });
  label('📐 من مخطط الإضاءة', 540, 1260, t, L.work, 0, { size: 60, bg: DARK, color: '#fff' });
  label('📦 لين التوريد', 540, 1400, t, L.supply, 0, { size: 60, bg: GOOD, color: '#06210f' });
  txt('(تصوير 3D توضيحي)', 540, 1820, { size: 34, weight: 700, color: 'rgba(255,255,255,.7)', alpha: prog(t, L.des, L.des + .5) });
}
function S7(t) { // address, WhatsApp, sign-off
  bgImg(IM['h_done-lit-1'], 1, 1.08 + .03 * prog(t, L.cta, L.end), 540, 1000); dim(.55);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.tun, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.wa - .2, L.wa + .2)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.opp - .2, L.opp + .2); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.opp - .1, L.opp + .4) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, L.sign, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.sign + .6, L.sign + 1.1) });
  if (t > L.sign) sparkles(t, L.sign, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, L.plan, S1], [L.plan, L.wire, S2], [L.wire, L.now, S3], [L.now, L.hall, S4], [L.hall, L.des, S5], [L.des, L.cta, S6], [L.cta, L.end, S7]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < L.des - .2) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
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
