// ---------- Living room: where do the spots go? (salonspots 3D body) ----------
const L = { hook: .36, mid: 1.46, wall: 2.26, most: 4.05, res: 6.1, face: 7.12, dark: 8.18, right: 10.18, seat: 11.06, cm: 12.95, art: 15.72, table: 17.6, tv: 19.33, notv: 20.41, refl: 21.95, photo: 23.48, wa1: 24.52, plan: 25.81, cta: 27.32, tun: 28.52, opp: 29.48, wa: 31.07, sign: 32.44, end: 34.2 };
function seq(keys, times, t, d, z, cx, cy) { let i = 0; while (i + 1 < keys.length && t >= times[i + 1]) i++; if (i === 0) { bgImg(IM[keys[0]], 1, z, cx, cy); return; } xfade(keys[i - 1], keys[i], t, times[i], d, z, cx, cy); }
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = a[0] === IM['p_good-1'] ? 'brightness(.78) contrast(1.08)' : 'none'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['w_mid', 'w_good-0.5', 'w_good-1', 'p_mid', 'p_good-1', 't_mid-tv', 't_good-1', 'c_marks'];
const BAD = 'rgba(160,30,25,.92)', DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function S1(t) { // living-room spots: in the middle, or by the wall?
  bgImg(IM.c_marks, 1, 1.04 + .05 * prog(t, 0, L.most), 540, 960); dim(.15); shade2();
  pop('سبوتات الصالة… 🤔', 540, 330, t, L.hook, 0, { size: 78, weight: 900, color: '#fff', glow: 25 });
  label('بالنص؟', 540, 1440, t, L.mid, 0, { size: 62, bg: DARK, color: '#fff' });
  label('ولا عند الجدار؟', 540, 1590, t, L.wall, 0, { size: 62, bg: DARK, color: '#fff' });
}
function S2(t) { // most people put them in the middle: shadow on faces, dark walls
  if (t < L.dark) bgImg(IM.w_mid, 1, 1.05 + .04 * prog(t, L.most, L.dark), 540, 960); else xfade('w_mid', 'p_mid', t, L.dark, .5, 1.05 + .04 * prog(t, L.dark, L.right), 540, 960);
  shade2();
  title2('أغلب الناس يحطونها بالنص ❌', t, L.most, 0, '#ff8a80', 58);
  chipAt('😕 ظل على الوجه', 1480, t, L.face, BAD);
  chipAt('🌑 والجدار مظلم', 1620, t, L.dark, BAD);
}
function S3(t) { // the right way: along the seating ~60 cm off the wall, one on the painting, one over the table
  const z = 1.04 + .05 * prog(t, L.right, L.tv);
  if (t < L.art) seq(['w_mid', 'w_good-0.5', 'w_good-1'], [L.right - 1, L.seat, L.seat + .8], t, .5, z, 540, 960);
  else xfade('w_good-1', 'p_good-1', t, L.art, .5, z, 540, 960);
  shade2();
  title2('الصح ✅', t, L.right, 0, '#7dff9c', 70);
  if (t < L.art) { chipAt('🛋️ تمشي مع الجلسة', 1420, t, L.seat, GOOD, '#06210f'); chipAt('📏 تقريبًا 60 سم من الجدار', 1560, t, L.cm); }
  else { chipAt('🖼️ سبوت موجّه على اللوحة', 1480, t, L.art, GOOD, '#06210f'); chipAt('☕ وواحد فوق الطاولة', 1620, t, L.table); }
}
function S4(t) { // the TV? no spot above it, because of the reflection
  if (t < L.refl + .6) bgImg(IM['t_mid-tv'], 1, 1.04 + .04 * prog(t, L.tv, L.photo), 540, 960); else xfade('t_mid-tv', 't_good-1', t, L.refl + .6, .5, 1.04 + .04 * prog(t, L.tv, L.photo), 540, 960);
  if (t < L.refl + .9) { const g = ctx.createRadialGradient(470, 760, 10, 470, 760, 260); g.addColorStop(0, 'rgba(255,245,225,.85)'); g.addColorStop(1, 'rgba(255,245,225,0)'); ctx.save(); ctx.globalAlpha = prog(t, L.notv, L.notv + .4); ctx.fillStyle = g; ctx.fillRect(150, 450, 640, 640); ctx.restore(); }
  shade2();
  title2('والتلفزيون؟ 📺', t, L.tv, 0, C.o2, 66);
  chipAt('❌ لا تحط سبوت فوقه', 1480, t, L.notv, BAD);
  chipAt('…عشان الانعكاس ✨', 1620, t, L.refl);
}
function S5(t) { // photograph your living room, send it on WhatsApp, we place them with you
  bgImg(IM['w_good-1'], 1, 1.08, 540, 960); dim(.45);
  pop('📸 صوّر صالتك', 540, 420, t, L.photo, 0, { size: 80, weight: 900, color: '#fff', glow: 25 });
  const q = E.back(prog(t, L.wa1, L.wa1 + .35)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-300, -70, 600, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('طرّشها واتساب 📲', 0, 4, { size: 58, weight: 900, color: '#fff' }); ctx.restore(); }
  chipAt('📐 ونوزعها وياك', 1400, t, L.plan, GOOD, '#06210f', 60);
}
function S6(t) { // address, WhatsApp, sign-off
  bgImg(IM['p_good-1'], 1, 1.08 + .03 * prog(t, L.cta, L.end), 540, 1000); dim(.55);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.tun, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.wa - .2, L.wa + .2)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.opp - .2, L.opp + .2); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.opp - .1, L.opp + .4) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, L.sign, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.sign + .5, L.sign + 1.0) });
  if (t > L.sign) sparkles(t, L.sign, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, L.most, S1], [L.most, L.right, S2], [L.right, L.tv, S3], [L.tv, L.photo, S4], [L.photo, L.cta, S5], [L.cta, L.end, S6]];
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
