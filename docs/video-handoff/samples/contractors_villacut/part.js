// ---------- Contractors: one supplier for the whole villa (villacut 3D body): dark villa → bought from 4 shops (mismatched colours, cheap flickering drivers) → QUALITY LIGHT: interior, hidden, outdoor IP65, steady drivers → bring the BOQ / drawing → CTA ----------
const L = {
  hook: .17, why: 1.01, five: 2.0,
  s1: 4.05, s2: 5.42, s3: 6.67, s4: 8.16,
  end1: 10.05, cols: 10.96, flick: 12.8,
  ql: 14.8, one: 16.05, inn: 17.88, hid: 18.69, out: 19.61, ip: 20.0, drv: 21.36,
  boq: 23.2, quote: 25.18,
  cta: 27.64, tun: 28.82, opp: 29.78, wa: 31.5, end: 33.1,
};
function xfade(a, b, t, t0, d, z, cx, cy) { bgImg(IM[a], 1, z, cx, cy); const k = E.inOut(prog(t, t0, t0 + d)); if (k > 0) bgImg(IM[b], k, z, cx, cy); }
function seq(keys, times, t, d, z, cx, cy) { let i = 0; while (i + 1 < keys.length && t >= times[i + 1]) i++; if (i === 0) { bgImg(IM[keys[0]], 1, z, cx, cy); return; } xfade(keys[i - 1], keys[i], t, times[i], d, z, cx, cy); }
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const _bgImg = bgImg; bgImg = function (...a) { ctx.filter = 'brightness(1.1) contrast(1.04) saturate(1.15)'; _bgImg(...a); ctx.filter = 'none'; };
const KEYS = ['w_off', 'w_ms', 'w_ms-mh', 'w_ms-mh-mo', 'd_cheap', 'g_mix', 'g_mix-flick-1', 'w_in-0.35', 'w_in-0.7', 'w_in', 'g_in-hid', 'u_in-hid', 'a_all', 'e_all', 'd_in-drv', 'w_all', 'u_all'];
const BAD = 'rgba(160,30,25,.92)', DARK = 'rgba(18,14,12,.88)';
function chipAt(s, y, t, t0, bg = DARK, color = '#fff', size = 54) { label(s, 540, y, t, t0, 0, { size, bg, color }); }
function shopCard(n, s, y, t, t0, col) { // a small numbered "shop receipt" card sliding in from the right
  const p = E.back(prog(t, t0, t0 + .35)); if (p <= 0) return;
  ctx.save(); ctx.translate(540 + (1 - p) * 600, y);
  ctx.fillStyle = 'rgba(250,246,238,.96)'; rrect(-400, -62, 800, 124, 26); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(320, 0, 42, 0, 7); ctx.fill();
  txt(n, 320, 4, { size: 50, weight: 900, color: '#fff', dir: 'ltr' });
  txt(s, -30, 4, { size: 52, weight: 900, color: '#1a1416' });
  ctx.restore();
}
function kChip(s, x, y, t, t0, col) { const p = E.back(prog(t, t0, t0 + .3)); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = 'rgba(10,8,8,.82)'; rrect(-105, -36, 210, 72, 36); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(-62, 0, 18, 0, 7); ctx.fill(); txt(s, 22, 3, { size: 40, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
function check(s, y, t, t0) { const p = E.back(prog(t, t0, t0 + .3)); if (p <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(p, p); ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-380, -58, 760, 116, 58); ctx.fill(); ctx.fillStyle = GOOD; ctx.beginPath(); ctx.arc(300, 0, 38, 0, 7); ctx.fill(); txt('✓', 300, 4, { size: 52, weight: 900, color: '#06210f', dir: 'ltr' }); txt(s, -40, 4, { size: 52, weight: 900, color: '#fff' }); ctx.restore(); }
function S1(t) { // contractor? why go round 5 shops for one villa?
  bgImg(IM.w_off, 1, 1.18 - .05 * prog(t, 0, L.s1), 540, 1040); shade2();
  pop('مقاول؟ 👷', 540, 330, t, L.hook, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('ليش تلف على 5 محلات…', 540, 470, t, L.why, 0, { size: 66, weight: 900, color: C.o2, glow: 20 });
  sub2('…عشان فيلا وحدة؟ 🧾', t, L.five, 0, DARK);
}
function S2(t) { // a shop for spots, a shop for strips, a shop for outdoor, drivers from a fourth
  if (t < L.s4) seq(['w_off', 'w_ms', 'w_ms-mh', 'w_ms-mh-mo'], [L.s1 - 1, L.s1 + .1, L.s2 + .1, L.s3 + .1], t, .45, 1.16 - .04 * prog(t, L.s1, L.s4), 540, 1040);
  else xfade('w_ms-mh-mo', 'd_cheap', t, L.s4, .45, 1.05 + .05 * prog(t, L.s4, L.end1), 540, 900);
  shade2();
  title2('4 محلات… لفيلا وحدة 🤯', t, L.s1, 0, C.o2, 62);
  const ys = t < L.s4 ? [1330, 1480, 1630] : [1180, 1330, 1480];
  shopCard('1', 'محل للسبوتات 💡', ys[0], t, L.s1, '#5b8cff');
  shopCard('2', 'محل للشرايط 〰️', ys[1], t, L.s2, '#ff8a2a');
  shopCard('3', 'محل للخارجي 🌴', ys[2], t, L.s3, '#4caf50');
  shopCard('4', 'درايفرات من محل رابع 🔌', 1630, t, L.s4, '#9c27b0');
}
function S3(t) { // and in the end? mismatched light colours + drivers that flicker with the dimmer
  const fl = t > L.flick + .3 && t < L.ql ? (Math.floor((t - L.flick) * 7) % 3 === 0) : false;
  bgImg(IM[fl ? 'g_mix-flick-1' : 'g_mix'], 1, 1.06 + .05 * prog(t, L.end1, L.ql), 540, 960); shade2();
  pop('وبالأخير؟ 😬', 540, 300, t, L.end1, 0, { size: 86, weight: 900, color: '#fff', glow: 25 });
  kChip('6500K', 170, 760, t, L.cols + .1, '#8fb4ff'); kChip('2700K', 540, 640, t, L.cols + .3, '#ff8a2a'); kChip('5000K', 910, 760, t, L.cols + .5, '#c4ffa8');
  chipAt('❌ ألوان ضو مو متطابقة', 1470, t, L.cols, BAD);
  chipAt('❌ درايفرات ترمّش مع الديمر', 1610, t, L.flick, BAD);
}
function S4(t) { // at QUALITY LIGHT the whole villa from one place
  if (t < L.one) { bgImg(IM.w_off, 1, 1.1, 540, 1040); dim(.45); }
  else seq(['w_off', 'w_in-0.35', 'w_in-0.7', 'w_in'], [L.one - 1, L.one, L.one + .6, L.one + 1.2], t, .5, 1.1 + .04 * prog(t, L.one, L.inn), 540, 1040);
  if (t >= L.one) shade2();
  const lp = prog(t, L.ql, L.ql + .45), fade = 1 - prog(t, L.one + .1, L.one + .5);
  if (fade > 0) { glow(540, 820, 260, C.o, .45 * lp * fade); drawImg(LOGO3D, 540, 800, 280 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) * fade }); drawImg(WM, 540, 1000, 330, { alpha: prog(t, L.ql + .3, L.ql + .8) * fade }); }
  if (t >= L.one) title2('الفيلا كلها من مكان واحد ✅', t, L.one, 0, GOOD, 60);
}
function S5(t) { // interior, hidden, outdoor against dust and water, drivers that don't flicker
  let k, z = 1.06 + .03 * prog(t, L.inn, L.boq), cy = 960;
  if (t < L.hid) k = ['w_in', 'g_in-hid'];
  else if (t < L.out) k = ['g_in-hid', 'u_in-hid'];
  else if (t < L.drv) k = ['u_in-hid', 'e_all'];
  else k = ['e_all', 'd_in-drv'];
  const t0 = t < L.hid ? L.inn : t < L.out ? L.hid : t < L.drv ? L.out : L.drv;
  xfade(k[0], k[1], t, t0 - .15, .4, z, 540, cy); shade2();
  title2('من مكان واحد 👇', t, L.inn, 0, C.o2, 58);
  check('داخلي 💡', 1240, t, L.inn); check('مخفي ✨', 1380, t, L.hid); check('خارجي IP65 🌧️', 1520, t, L.out); check('درايفرات ما ترمّش 🔌', 1660, t, L.drv);
}
function boqCard(t, t0) { // a BOQ sheet with rows ticking off
  const p = E.back(prog(t, t0, t0 + .45)); if (p <= 0) return;
  ctx.save(); ctx.translate(540, 900); ctx.rotate(-.04); ctx.scale(p, p);
  ctx.fillStyle = '#fbf7ef'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; rrect(-330, -380, 660, 760, 30); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#2b2b2b'; rrect(-120, -410, 240, 60, 14); ctx.fill();
  txt('جدول الكميات 📋', 0, -290, { size: 52, weight: 900, color: '#1a1416' });
  const rows = ['سبوتات', 'شرايط مخفية', 'خارجي IP65', 'درايفرات'];
  rows.forEach((r, i) => { const y = -170 + i * 120, q = prog(t, t0 + .5 + i * .3, t0 + .8 + i * .3); ctx.strokeStyle = '#d8cfbf'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-280, y + 50); ctx.lineTo(280, y + 50); ctx.stroke(); txt(r, 60, y, { size: 46, weight: 800, color: '#3a3230' }); if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = GOOD; ctx.beginPath(); ctx.arc(-220, y, 30, 0, 7); ctx.fill(); txt('✓', -220, y + 3, { size: 42, weight: 900, color: '#06210f', dir: 'ltr' }); ctx.restore(); } });
  ctx.restore();
}
function S6(t) { // bring the BOQ or the drawing, and we prepare one quote for the whole villa
  bgImg(IM.w_all, 1, 1.12 + .04 * prog(t, L.boq, L.cta), 540, 1040); dim(.5);
  title2('جيب جدول الكميات أو المخطط', t, L.boq, 0, C.o2, 56);
  boqCard(t, L.boq + .3);
  label('🧾 عرض سعر للفيلا كاملة', 540, 1520, t, L.quote, 0, { size: 60, bg: GOOD, color: '#06210f' });
}
function S7(t) { // address, WhatsApp, sign-off
  bgImg(IM.w_all, 1, 1.12 + .03 * prog(t, L.cta, L.end), 540, 1040); dim(.55);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.tun, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.wa - .2, L.wa + .2)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.opp - .2, L.opp + .2); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.opp - .1, L.opp + .4) });
  pop('مورد واحد… لمشروعك كله ✨', 540, 1500, t, L.opp + .3, 0, { size: 70, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.opp + .8, L.opp + 1.3) });
  if (t > L.opp) sparkles(t, L.opp, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, L.s1, S1], [L.s1, L.end1, S2], [L.end1, L.ql, S3], [L.ql, L.inn, S4], [L.inn, L.boq, S5], [L.boq, L.cta, S6], [L.cta, L.end, S7]];
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
