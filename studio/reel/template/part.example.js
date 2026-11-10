// ---------- Apartment lobby (lobby 3D body): cold flat panels → hidden 3000 K ceiling cove → sconces + glare-free downlights → welcoming entrance ----------
// first-videos style: the 3D lobby is the picture and the light changes inside it; the cover is a real frame picked by the owner
const L = {
  hook: .45, park: 1.63,                         // عمارتك جديدة… / بس اللوبي يحسسك إنك داخل مواقف؟
  panels: 4.72, cold: 6.9,                       // بانلات بيضا باردة / والساكن يدخل وما يحس بشي
  fix: 9.11, cove: 9.78, k: 11.21, warm: 12.6,   // الحل / إضاءة مخفية بالسقف / 3000K / دافي وفخم
  sconce: 14.94, downs: 16.5,                    // أباليك على الجدار / داون لايت مانع للزغللة
  door: 19.94, value: 22.28,                     // المدخل ينوّر ويرحب فيك / العمارة تبين قيمتها وتتأجر أسرع
  ql: 25.2, design: 26.32, fee: 28.43,
  cta: 30.99, sign: 33.44, end: 36.0,
};
function seq(keys, t, t0, t1, z, cx, cy) { const n = keys.length - 1, f = clamp((t - t0) / (t1 - t0)) * n, k = Math.min(n, Math.floor(f)), fr = f - k; bgImg(IM[keys[k]], 1, z, cx, cy); if (k < n && fr > 0) bgImg(IM[keys[k + 1]], E.inOut(fr), z, cx, cy); }
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
function chipL(s, x, y, t, t0, col, color = '#fff', size = 64) { label(s, x, y, t, t0, 0, { size, bg: col, color, dir: 'ltr' }); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = 'brightness(1.08) contrast(1.03)'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['w_off', 'w_panels', 'w_cove-0.5', 'w_cove', 'w_all', 'm_panels', 'm_all', 'e_panels', 'e_all', 'u_panels', 'u_cove-0.5', 'u_cove', 'u_all'];

function S1(t) { // your building is new… but the lobby feels like a car park?
  bgImg(IM.w_all, 1, 1.1 - .07 * prog(t, 0, L.panels), 540, 1000); shade2();
  pop('عمارتك جديدة 🏢', 540, 300, t, L.hook, 0, { size: 76, weight: 900, color: '#fff', glow: 25 });
  pop('بس اللوبي… كأنه مواقف؟', 540, 420, t, L.park, 0, { size: 64, weight: 900, color: C.o2, glow: 25 });
}
function S2(t) { // cold white panels overhead; the resident walks in and feels nothing
  if (t < L.cold) seq(['w_off', 'w_panels'], t, L.panels + .1, L.panels + .5, 1.03 + .05 * prog(t, L.panels, L.cold), 540, 1000);
  else xfade('w_panels', 'm_panels', t, L.cold - .1, .5, 1.04 + .04 * prog(t, L.cold, L.fix), 540, 1000);
  shade2();
  title2('بانلات بيضا باردة ❌', t, L.panels, 0, C.red, 66);
  sub2('الساكن يدخل… وما يحس بشي', t, L.cold, 0, 'rgba(18,14,12,.9)');
}
function S3(t) { // a hidden strip in the ceiling cove, 3000 K: warm and premium
  if (t < L.warm) seq(['u_panels', 'u_cove-0.5', 'u_cove'], t, L.fix + .3, L.k - .1, 1.03 + .04 * prog(t, L.fix, L.warm), 540, 900);
  else xfade('u_cove', 'w_cove', t, L.warm - .1, .6, 1.07 - .04 * prog(t, L.warm, L.sconce), 540, 1000);
  shade2();
  title2('إضاءة مخفية بالسقف ✨', t, L.cove, 0, C.amber, 62);
  if (t >= L.k && t < L.warm + .4) chipL('3000K', 540, 1450, t, L.k, C.o2, '#fff', 80);
  sub2('اللوبي صار دافي وفخم ✓', t, L.warm, 0, GOOD, '#06210f');
}
function S4(t) { // wall sconces + glare-free downlights over the desk and the mailboxes
  if (t < L.downs) seq(['w_cove', 'w_all'], t, L.sconce + .1, L.sconce + .9, 1.03 + .05 * prog(t, L.sconce, L.downs), 540, 1000);
  else xfade('w_all', 'm_all', t, L.downs - .1, .5, 1.04 + .04 * prog(t, L.downs, L.door), 540, 1000);
  shade2();
  title2('أباليك على الجدار 🕯️', t, L.sconce, 0, C.amber, 64);
  sub2('وداون لايت ما يزغلل ✓', t, L.downs, 0, 'rgba(18,14,12,.9)');
}
function S5(t) { // the entrance welcomes you: the building shows its value and rents faster
  seq(['e_panels', 'e_all'], t, L.door + .1, L.door + .9, 1.03 + .05 * prog(t, L.door, L.ql), 540, 1000); shade2();
  title2('المدخل يرحب فيك 🚪', t, L.door, 0, C.amber, 66);
  sub2('العمارة تبين قيمتها… وتتأجر أسرع 📈', t, L.value, 0, GOOD, '#06210f');
}
function S6(t) { // QUALITY LIGHT designs the whole lobby; design fee deducted
  bgImg(IM.w_all, 1, 1.06 + .04 * prog(t, L.ql, L.cta), 540, 1000); dim(.4);
  const lp = prog(t, L.ql + .2, L.ql + .6); glow(540, 300, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 300, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 460, 270, { alpha: prog(t, L.ql + .4, L.ql + 1) });
  if (t < L.fee) {
    const p = E.back(prog(t, L.design, L.design + .4)); if (p > 0) { ctx.save(); ctx.translate(540, 1350); ctx.scale(p, p); ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-460, -70, 920, 140, 70); ctx.fill(); ctx.strokeStyle = C.o; ctx.lineWidth = 5; rrect(-460, -70, 920, 140, 70); ctx.stroke(); txt('نصمم إضاءة اللوبي كاملة ✓', 0, 4, { size: 50, weight: 900, color: '#fff' }); ctx.restore(); }
  } else {
    const q = E.back(prog(t, L.fee, L.fee + .4)); if (q > 0) { ctx.save(); ctx.translate(540, 1300); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, L.fee + .6, L.fee + 1.1); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1520, t, L.fee + 1.0, 0, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S7(t) { // address, WhatsApp, sign-off
  bgImg(IM.e_all, 1, 1.05 + .03 * prog(t, L.cta, L.end), 540, 1000); dim(.55);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.cta + .6, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.cta + 1.1, L.cta + 1.5)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.sign - .2, L.sign + .2); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.sign - .1, L.sign + .4) });
  pop('خلّ عمارتك تنوّر صح ✨', 540, 1500, t, L.sign, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.sign + .6, L.sign + 1.1) });
  if (t > L.sign) sparkles(t, L.sign, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, L.panels, S1], [L.panels, L.fix, S2], [L.fix, L.sconce, S3], [L.sconce, L.door, S4], [L.door, L.ql, S5], [L.ql, L.cta, S6], [L.cta, L.end, S7]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < L.ql - .2) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
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
