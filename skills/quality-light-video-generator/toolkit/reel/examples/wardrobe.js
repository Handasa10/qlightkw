// ---------- wardrobe: dark closet -> sensor doors, hidden LED, lit rail, lit drawers ----------
function bgImg(img, a = 1, z = 1, cx = 540, cy = 960) { if (!img || a <= 0) return; const w = 1080 * z, h = 1920 * z; ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(img, cx - w * (cx / 1080), cy - h * (cy / 1920), w, h); ctx.restore(); }
function shade2() { const g = ctx.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, 'rgba(8,6,5,.72)'); g.addColorStop(1, 'rgba(8,6,5,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 560); const g2 = ctx.createLinearGradient(0, 1380, 0, 1920); g2.addColorStop(0, 'rgba(8,6,5,0)'); g2.addColorStop(1, 'rgba(8,6,5,.8)'); ctx.fillStyle = g2; ctx.fillRect(0, 1380, W, 540); }
function title2(s, t, t0, t1, col = '#fff', size = 68, y = 330) { label(s, 540, y, t, t0, t1, { size, bg: 'rgba(18,14,12,.84)', color: col }); }
function sub2(s, t, t0, t1, bg = C.o, color = '#fff', y = 1650) { label(s, 540, y, t, t0, t1, { size: 50, bg, color }); }
// crossfade between keyed images: list of [time, imageKey]
function keyed(t, keys, z = 1, cx = 540, cy = 960, dur = .45) {
  let a = keys[0][1], b = a, k = 1;
  for (let i = 0; i < keys.length; i++) if (t >= keys[i][0]) { a = i ? keys[i - 1][1] : keys[0][1]; b = keys[i][1]; k = E.out(prog(t, keys[i][0], keys[i][0] + dur)); }
  bgImg(IM[a], 1, z, cx, cy); if (a !== b) bgImg(IM[b], k, z, cx, cy);
}
function flash(t, t0, a = .35) { if (t > t0 && t < t0 + .6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,236,210,${a * (1 - prog(t, t0, t0 + .6))})`; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
function sensor(x, y, s, t, a, on = true) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 40 * s, 0, 7); ctx.fill(); ctx.fillStyle = on ? C.o : '#555'; ctx.beginPath(); ctx.arc(0, 0, 16 * s, 0, 7); ctx.fill();
  if (on) for (let i = 0; i < 3; i++) { const p = ((t * 1.2 + i / 3) % 1); ctx.strokeStyle = `rgba(255,122,53,${1 - p})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, (46 + 110 * p) * s, Math.PI * .15, Math.PI * .85); ctx.stroke(); }
  ctx.restore();
}
function onOff(on, x, y, t, t0, t1) { label(on ? 'ON 💡' : 'OFF', x, y, t, t0, t1, { size: 54, bg: on ? GOOD : '#3a2f3f', color: on ? '#06210f' : '#fff', dir: 'ltr' }); }
function swatch(x, y, col, name, a, low) { // a garment colour chip
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; rrect(x - 110, y - 70, 220, 140, 22); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3; rrect(x - 110, y - 70, 220, 140, 22); ctx.stroke();
  txt(name, x, y + 110, { size: 40, weight: 900, color: '#fff' }); ctx.restore();
}
function wardrobePlan(x, y, w, h, t, t0) { // elevation drawing with LED lines
  ctx.save(); ctx.fillStyle = '#f7f3ed'; rrect(x, y, w, h, 26); ctx.fill(); ctx.clip();
  const X = v => x + 90 + (w - 180) * v / 2.4, Y = v => y + h - 90 - (h - 180) * v / 2.6;
  ctx.strokeStyle = '#2a221c'; ctx.lineWidth = 6; ctx.strokeRect(X(0), Y(2.6), X(2.4) - X(0), Y(0) - Y(2.6));
  ctx.lineWidth = 3; for (const v of [.9, 1.6]) { ctx.beginPath(); ctx.moveTo(X(v), Y(0)); ctx.lineTo(X(v), Y(2.6)); ctx.stroke(); }
  const shelves = [[0, .9, 2.15], [0, .9, .3], [0, .9, .62], [.9, 1.6, 1.15], [.9, 1.6, 1.45], [.9, 1.6, 1.75], [.9, 1.6, 2.05], [.9, 1.6, 2.35], [1.6, 2.4, 2.15]];
  for (const [a, b, v] of shelves) { ctx.beginPath(); ctx.moveTo(X(a), Y(v)); ctx.lineTo(X(b), Y(v)); ctx.stroke(); }
  for (let d = 0; d < 3; d++) ctx.strokeRect(X(.92), Y(.1 + d * .33 + .3), X(1.58) - X(.92), Y(.1) - Y(.4));
  ctx.setLineDash([10, 8]); for (const [a, b] of [[0, .9], [1.6, 2.4]]) { ctx.beginPath(); ctx.moveTo(X(a + .03), Y(1.95)); ctx.lineTo(X(b - .03), Y(1.95)); ctx.stroke(); } ctx.setLineDash([]);
  // LED lines appear one after another
  const leds = [...shelves.map(([a, b, v]) => [X(a + .03), Y(v) + 6, X(b - .03), Y(v) + 6]), [X(.03), Y(1.93), X(.87), Y(1.93)], [X(1.63), Y(1.93), X(2.37), Y(1.93)], ...[0, .9, 1.6, 2.4].map(v => [X(v) + (v ? -8 : 8), Y(.1), X(v) + (v ? -8 : 8), Y(2.55)])];
  leds.forEach(([x0, y0, x1, y1], i) => { const q = prog(t, t0 + i * .05, t0 + .35 + i * .05); if (q <= 0) return; ctx.save(); ctx.strokeStyle = C.o; ctx.lineWidth = 7; ctx.shadowColor = C.o; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q); ctx.stroke(); ctx.restore(); });
  txt('2.40 m', x + w / 2, y + h - 40, { size: 30, weight: 800, color: '#2a221c', dir: 'ltr' });
  ctx.restore();
}

function S1(t) { // 0–4.9 morning, searching in a dim closet
  bgImg(IM.f_closed, 1, 1.05 + .05 * prog(t, 0, 5), 540, 1000); shade2();
  pop('تفتح الدولاب الصبح… ☀️', 540, 520, t, .22, 4.9, { size: 82, weight: 900, color: '#fff', glow: 25 });
  swatch(330, 1250, '#f7f5f0', 'الثوب الأبيض', E.out(prog(t, 1.8, 2.2)));
  swatch(750, 1250, '#1f2a44', 'القميص الكحلي', E.out(prog(t, 3.4, 3.8)));
  if (t > 1.9) { const r = .5 + .5 * Math.sin(t * 5); ctx.save(); ctx.globalAlpha *= .9; txt('🔍', 540 + 140 * Math.sin(t * 2.2), 1000 + 30 * r, { size: 90, dir: 'ltr' }); ctx.restore(); }
}
function S2(t) { // 4.9–9.6 everything looks the same in the dark
  bgImg(IM.f_dark, 1, 1.1 + .05 * prog(t, 4.9, 9.6), 540, 1050); ctx.fillStyle = 'rgba(5,6,12,.25)'; ctx.fillRect(0, 0, W, H); shade2();
  pop('كله معتم…', 540, 480, t, 5.21, 9.6, { size: 100, weight: 900, color: '#cfd8ff', glow: 25, glowColor: '#5a6cff' });
  const a = E.out(prog(t, 6.42, 6.8)); if (a > 0) { swatch(330, 1250, '#20232c', '؟', a); swatch(750, 1250, '#1d2029', '؟', a); txt('=', 540, 1250, { size: 110, weight: 900, color: '#fff', alpha: a, dir: 'ltr' }); }
  sub2('الألوان تتشابه… وتطلع غلط 😬', t, 6.42, 9.6, '#7a1f1f');
}
function S3(t) { // 9.6–12.35 imagine
  const z = 1.12 - .06 * E.inOut(prog(t, 9.6, 12.3)); bgImg(IM.f_dark, 1, z, 540, 1000); bgImg(IM.f_all, E.inOut(prog(t, 10.9, 12.0)) * .55, z, 540, 1000); shade2();
  ctx.fillStyle = 'rgba(8,6,5,.3)'; ctx.fillRect(0, 0, W, H);
  pop('بس تخيّل دولابك…', 540, 830, t, 10.0, 12.35, { size: 90, weight: 900, color: '#fff', glow: 25 });
  pop('بالشكل هذا ✨', 540, 970, t, 10.9, 12.35, { size: 96, weight: 900, color: C.o2, glow: 30 });
  if (t > 11.0) sparkles(t, 11.0, 14, 160, 700, 760, 700);
}
function S4(t) { // 12.35–20.3 door sensor
  keyed(t, [[12.35, 'd_0'], [12.9, 'd_5on'], [13.9, 'd_1on'], [17.07, 'd_5on'], [18.71, 'd_5off'], [19.41, 'd_0']], 1.04, 540, 960, .35);
  flash(t, 12.9); flash(t, 17.9, .25); shade2();
  title2('تفتح الباب…', t, 12.66, 13.8, '#fff', 74);
  title2('والإضاءة تشتغل بروحها!', t, 13.84, 16.0, C.o2, 66);
  title2('حساس على الباب', t, 16.01, 20.3, '#fff', 70);
  sensor(540, 640, 1.1, t, E.out(prog(t, 16.05, 16.4)), t < 18.6);
  onOff(true, 540, 1650, t, 17.07, 18.6); if (t >= 18.71) onOff(false, 540, 1650, t, 18.71, 20.3);
  label('تفتح', 270, 1500, t, 17.07, 18.6, { size: 46, bg: 'rgba(18,14,12,.84)' }); label('تسكّر', 270, 1500, t, 18.71, 20.3, { size: 46, bg: 'rgba(18,14,12,.84)' });
}
function S5(t) { // 20.3–28.85 hidden profiles: sides, under every shelf, soft light
  if (t < 25.9) {
    keyed(t, [[20.3, 'f_dark'], [20.63, 'f_side'], [23.47, 'f_shelf']], 1.04, 540, 980, .5);
    flash(t, 20.63, .2); flash(t, 23.47, .2); shade2();
    title2('شريط LED داخل بروفايل ألمنيوم', t, 20.63, 23.4, '#fff', 54);
    title2('تحت كل رف… وعلى الجوانب', t, 23.47, 25.9, C.o2, 60);
  } else {
    bgImg(IM.s_all, 1, 1.02 + .06 * prog(t, 25.9, 28.85), 540, 960); shade2();
    title2('نور ناعم… بدون زغللة', t, 25.91, 28.85, GOOD, 66);
    if (t > 26.4) sparkles(t, 26.4, 10, 160, 600, 760, 700);
  }
}
function S6(t) { // 28.85–36.4 the hanging rail itself is lit
  if (t < 31.4) {
    keyed(t, [[28.85, 'f_shelf'], [29.4, 'f_rail']], 1.08 + .1 * E.inOut(prog(t, 29.2, 31.4)), 380, 900, .5); flash(t, 29.4, .2); shade2();
    title2('وعمود التعليق نفسه منوّر 💡', t, 29.18, 31.4, '#fff', 60);
  } else {
    keyed(t, [[31.4, 'r_dark'], [31.75, 'r_all']], 1.02 + .05 * prog(t, 31.4, 36.4), 540, 900, .6); flash(t, 31.75, .25); shade2();
    title2('ينوّر الملابس من فوق', t, 31.46, 35.25, C.o2, 66);
    label('وتبين كل قطعة بوضوح ✓', 540, 1650, t, 35.3, 36.4, { size: 50, bg: GOOD, color: '#06210f' });
  }
}
function S7(t) { // 36.4–43.5 drawers light up inside
  keyed(t, [[36.4, 'dr_closed'], [37.6, 'dr_open'], [39.13, 'dr_lit']], 1.03 + .06 * prog(t, 36.4, 43.5), 540, 1000, .5); flash(t, 39.13, .3);
  const gl = E.out(prog(t, 39.13, 39.7)); if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(540, 1250, 50, 540, 1250, 620); g.addColorStop(0, `rgba(255,214,162,${.28 * gl})`); g.addColorStop(1, 'rgba(255,214,162,0)'); ctx.fillStyle = g; ctx.fillRect(0, 600, W, 1300); ctx.restore(); }
  shade2();
  title2('والأدراج بعد…', t, 36.54, 39.1, '#fff', 76);
  title2('تفتح الدرج والنور يشتغل داخله', t, 39.13, 43.5, C.o2, 56);
  label('⌚ الساعة', 300, 1500, t, 40.6, 43.5, { size: 46, bg: 'rgba(18,14,12,.84)' }); label('العطر 🧴', 780, 1500, t, 41.2, 43.5, { size: 46, bg: 'rgba(18,14,12,.84)' });
  sub2('تلقاها بثانية ⚡', t, 42.38, 43.5, GOOD, '#06210f');
}
function S8(t) { // 43.5–49.25 colour rendering: CRI 90+
  const z = 1.06; bgImg(IM.r_all, 1, z, 540, 1000);
  const pos = lerp(1080, 540, E.inOut(prog(t, 43.9, 44.6)));
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pos, H); ctx.clip(); ctx.filter = 'saturate(.12) sepia(.55) hue-rotate(40deg) brightness(.82) contrast(.85)'; bgImg(IM.r_all, 1, z, 540, 1000); ctx.filter = 'none'; ctx.restore();
  if (pos < 1079) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(pos - 4, 0, 8, H); ctx.restore(); }
  shade2();
  title2('والأهم: تجسيد الألوان', t, 43.86, 49.25, '#fff', 64);
  label('CRI ضعيف', 270, 520, t, 44.2, 49.25, { size: 50, bg: '#7a1f1f' }); label('CRI 90+', 810, 520, t, 44.5, 49.25, { size: 56, bg: GOOD, color: '#06210f', dir: 'ltr' });
  const s1 = E.out(prog(t, 46.15, 46.5)), s2 = E.out(prog(t, 47.84, 48.2));
  if (s1 > 0) { ctx.save(); ctx.globalAlpha *= s1; ctx.fillStyle = 'rgba(14,11,9,.85)'; rrect(150, 1170, 780, 330, 30); ctx.fill(); ctx.restore(); }
  if (s1 > 0 && s2 < 1) { swatch(330, 1290, '#3b3a35', 'كحلي؟', s1 * (1 - s2)); swatch(750, 1290, '#1f2a44', 'كحلي ✓', s1 * (1 - s2)); }
  if (s2 > 0) { swatch(330, 1290, '#2e2a26', 'أسود؟', s2); swatch(750, 1290, '#0a0a0a', 'أسود ✓', s2); }
}
function S9(t) { // 49.25–53.95 low voltage, safe, no heat
  bgImg(IM.s_all, 1, 1.15, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 49.45, 49.85)); if (p > 0) { ctx.save(); ctx.translate(540, 640); ctx.scale(p, p); ctx.fillStyle = GOOD; ctx.shadowColor = GOOD; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 150, 0, 7); ctx.fill(); ctx.restore(); icon(IC.shield, 540, 640, 190 * p, 1, { color: '#06210f', lw: 10 }); icon(IC.shieldCheck, 540, 640, 190 * p, prog(t, 49.8, 50.3), { color: '#06210f', lw: 12 }); }
  pop('فولت منخفض 12V / 24V', 540, 900, t, 49.74, 0, { size: 70, weight: 900, color: '#fff', glow: 20 });
  label('آمن ✓', 330, 1100, t, 51.39, 0, { size: 60, bg: GOOD, color: '#06210f' });
  label('ما يطلع حرارة 🌡️', 760, 1100, t, 52.0, 0, { size: 52, bg: 'rgba(18,14,12,.84)' });
  label('على الملابس', 540, 1250, t, 52.5, 0, { size: 52, bg: C.o });
}
function S10(t) { // 53.95–59.4 a boutique at home
  bgImg(IM.room, 1, 1.0 + .07 * E.inOut(prog(t, 53.95, 59.4)), 540, 960); shade2();
  label('دولاب مرتب', 540, 320, t, 54.22, 0, { size: 66, bg: 'rgba(18,14,12,.84)' });
  label('أنيق ✨', 540, 450, t, 55.88, 0, { size: 66, bg: C.o });
  title2('وكأنه محل فخم في بيتك 🛍️', t, 56.89, 59.4, C.o2, 62, 1650);
  if (t > 57.0) sparkles(t, 57.0, 16, 120, 500, 840, 900);
}
function S11(t) { // 59.4–66.3 QUALITY LIGHT designs it to size, fee deducted
  bgImg(IM.f_all, 1, 1.12, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  const lp = prog(t, 59.66, 60.1); glow(540, 290, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 290, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 450, 270, { alpha: prog(t, 59.9, 60.5) });
  if (t < 63.95) {
    pop('نصمم إضاءة الدواليب والرفوف', 540, 590, t, 60.3, 63.95, { size: 58, weight: 900, color: '#fff', glow: 20 });
    const c = E.out(prog(t, 60.6, 61.1)); if (c > 0) {
      const x = 140, y = 690, w = 800, h = 900; ctx.save(); ctx.globalAlpha *= c; wardrobePlan(x, y, w, h, t, 61.0); ctx.restore();
      const wp = E.inOut(prog(t, 62.6, 63.5)); if (wp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * wp, h); ctx.clip(); imgCard(IM.f_all, x, y, w, h, { r: 26, shadow: false, sx: 60, sy: 280, sw: 960, sh: 1080 }); ctx.restore(); if (wp < 1) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(x + w * wp - 4, y, 8, h); ctx.restore(); } }
      label('حسب مقاساتك 📐', 540, 1660, t, 61.6, 63.95, { size: 50, bg: GOOD, color: '#06210f' });
    }
  } else {
    const q = E.back(prog(t, 63.98, 64.4)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, 64.6, 65.1); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1120, t, 64.9, 66.3, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S12(t) { // 66.3–end address, WhatsApp, sign-off
  bgImg(IM.room, 1, 1.05 + .03 * prog(t, 66.3, 75), 540, 960); ctx.fillStyle = 'rgba(8,6,5,.74)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 66.56, 66.95)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, 66.56, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, 67.47, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, 70.07, 70.5)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, 71.69, 72.1); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, 71.8, 72.3) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, 72.91, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, 73.3, 73.8) });
  if (t > 73.1) sparkles(t, 73.1, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, 4.9, S1, .6], [4.9, 9.6, S2, .4], [9.6, 12.35, S3, .5], [12.35, 20.3, S4, .9], [20.3, 28.85, S5, .9], [28.85, 36.4, S6, .9], [36.4, 43.5, S7, .9], [43.5, 49.25, S8, 1], [49.25, 53.95, S9, .8], [53.95, 59.4, S10, 1], [59.4, 66.3, S11, .9], [66.3, 75.0, S12, 1]];
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < 59.3) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  finish(t);
  if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, W, H); }
  if (t > 74.4) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - 74.4) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of ['f_closed', 'f_dark', 'f_side', 'f_shelf', 'f_rail', 'f_all', 'd_0', 'd_5on', 'd_1on', 'd_5off', 's_dark', 's_all', 'r_dark', 'r_all', 'dr_closed', 'dr_open', 'dr_lit', 'room']) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
