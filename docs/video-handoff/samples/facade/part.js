// ---------- Villa facade at night (facade 3D body): dark villa → one cold floodlight on the gate → layers: wall washers, palm up-lights, path lights → IP65 in the rain, 3000 K → seen from the end of the street → CTA ----------
const L = {
  hook: .35, night: 1.91, where: 3.08, bad: 4.46, dark: 6.38,
  layers: 8.08, wash: 10.28, palm: 13.13, path: 14.53,
  ip: 17.48, ip65: 18.27, dust: 19.82, k3: 21.48,
  sud: 23.64, street: 24.55,
  cta: 27.25, tun: 28.41, opp: 29.34, wa: 30.87, sign: 32.24, end: 34.2,
};
function seq(keys, times, t, d, z, cx, cy) { let i = 0; while (i + 1 < keys.length && t >= times[i + 1]) i++; if (i === 0) { bgImg(IM[keys[0]], 1, z, cx, cy); return; } xfade(keys[i - 1], keys[i], t, times[i], d, z, cx, cy); }
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = 'brightness(1.12) contrast(1.04)'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['w_off', 'w_bad', 'w_wash-0.5', 'w_wash', 'w_wash-palm', 'w_wash-palm-path-0.5', 'w_wash-palm-path', 'w_all', 'g_all', 's_all', 's_off'];
const BAD = 'rgba(160,30,25,.92)', DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function step(n, s, y, t, t0) { const p = E.back(prog(t, t0, t0 + .35)); if (p <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(p, p); ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-420, -58, 840, 116, 58); ctx.fill(); ctx.fillStyle = C.o; ctx.beginPath(); ctx.arc(362, 0, 42, 0, 7); ctx.fill(); txt(n, 362, 5, { size: 52, weight: 900, color: '#fff', dir: 'ltr' }); txt(s, -30, 4, { size: 50, weight: 900, color: '#fff' }); ctx.restore(); }
function rain(t, a) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(200,215,255,.55)'; ctx.lineWidth = 3; for (let i = 0; i < 120; i++) { const x = (i * 97.3 + t * 260) % 1180 - 50, y = ((i * 211.7) + t * 2300) % 2000 - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 70); ctx.stroke(); } ctx.restore(); }
function S1(t) { // your house looks nice by day… but at night? where did it go?
  bgImg(IM.w_off, 1, 1.08 - .04 * prog(t, 0, L.bad), 540, 860); shade2();
  pop('بيتك بالنهار حلو… ☀️', 540, 330, t, L.hook, 0, { size: 74, weight: 900, color: '#fff', glow: 25 });
  pop('بس بالليل؟ 🌙', 540, 460, t, L.night, 0, { size: 84, weight: 900, color: C.o2, glow: 30 });
  pop('وين راح؟ 🤔', 540, 1600, t, L.where, 0, { size: 96, weight: 900, color: '#fff', glow: 30 });
}
function S2(t) { // one white floodlight on the gate, and the rest is dark
  bgImg(IM.w_bad, 1, 1.06 + .03 * prog(t, L.bad, L.layers), 540, 900); shade2();
  chipAt('❌ كشاف واحد أبيض على البوابة', 330, t, L.bad + .1, BAD);
  chipAt('…والباقي ظلام 🌑', 1620, t, L.dark, DARK);
}
function S3(t) { // the facade needs layers: wall washers, palm up-lights, path lights to the door
  const z = 1.05 + .05 * prog(t, L.layers, L.ip);
  seq(['w_off', 'w_wash-0.5', 'w_wash', 'w_wash-palm', 'w_wash-palm-path-0.5', 'w_wash-palm-path'], [L.layers - 1, L.wash, L.wash + .6, L.palm, L.path, L.path + .6], t, .5, z, 540, 880);
  shade2();
  title2('الواجهة تبيلها طبقات ✨', t, L.layers, 0, C.o2, 62);
  step('1', 'وول واشر يغسل الجدار ⬆️', 1360, t, L.wash);
  step('2', 'أب لايت على النخل 🌴', 1500, t, L.palm);
  step('3', 'إضاءة ممر توصلك للباب 🚶', 1640, t, L.path);
}
function S4(t) { // all IP65, against dust and water, at a warm 3000 K
  bgImg(IM.g_all, 1, 1.05 + .05 * prog(t, L.ip, L.sud), 540, 960); shade2(); rain(t, prog(t, L.ip, L.ip + .5) * .9);
  const p = E.back(prog(t, L.ip65, L.ip65 + .4)); if (p > 0) { ctx.save(); ctx.translate(540, 420); ctx.scale(p, p); ctx.fillStyle = '#1565c0'; ctx.shadowColor = '#42a5f5'; ctx.shadowBlur = 50; rrect(-230, -90, 460, 180, 40); ctx.fill(); ctx.shadowBlur = 0; txt('IP65', 0, 8, { size: 120, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  chipAt('🌧️ ضد الغبار والمية', 1480, t, L.dust, DARK);
  chipAt('🔥 ثلاث آلاف كلفن… دافي ✓', 1620, t, L.k3, GOOD, '#06210f');
}
function S5(t) { // and suddenly your villa stands out from the end of the street
  xfade('s_off', 's_all', t, L.sud + .2, .6, 1.12 + .08 * prog(t, L.sud, L.cta), 560, 900); shade2();
  pop('وفجأة… ✨', 540, 330, t, L.sud, 0, { size: 90, weight: 900, color: '#fff', glow: 30 });
  chipAt('فيلتك تبين من أول الشارع 🏡', 1600, t, L.street, GOOD, '#06210f');
}
function S6(t) { // address, WhatsApp, sign-off
  bgImg(IM.w_all, 1, 1.1 + .03 * prog(t, L.cta, L.end), 540, 900); dim(.55);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.tun, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.wa - .2, L.wa + .2)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.opp - .2, L.opp + .2); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.opp - .1, L.opp + .4) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, L.sign, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.sign + .5, L.sign + 1.0) });
  if (t > L.sign) sparkles(t, L.sign, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, L.bad, S1], [L.bad, L.layers, S2], [L.layers, L.ip, S3], [L.ip, L.sud, S4], [L.sud, L.cta, S5], [L.cta, L.end, S6]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < L.cta - .2) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
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
