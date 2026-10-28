// ---------- staircase: ordinary -> hidden LED under every tread ----------
function bgImg(img, a = 1, z = 1, cx = 540, cy = 960) { if (!img || a <= 0) return; const w = 1080 * z, h = 1920 * z; ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(img, cx - w * (cx / 1080), cy - h * (cy / 1920), w, h); ctx.restore(); }
function shade2() { const g = ctx.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, 'rgba(8,6,5,.72)'); g.addColorStop(1, 'rgba(8,6,5,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 560); const g2 = ctx.createLinearGradient(0, 1380, 0, 1920); g2.addColorStop(0, 'rgba(8,6,5,0)'); g2.addColorStop(1, 'rgba(8,6,5,.8)'); ctx.fillStyle = g2; ctx.fillRect(0, 1380, W, 540); }
function title2(s, t, t0, t1, col = '#fff', size = 68, y = 330) { label(s, 540, y, t, t0, t1, { size, bg: 'rgba(18,14,12,.84)', color: col }); }
function sub2(s, t, t0, t1, bg = C.o, color = '#fff', y = 1650) { label(s, 540, y, t, t0, t1, { size: 50, bg, color }); }
// sequence of renders: step k lit (0 = all dark)
function seqImg(view, k) { return k <= 0 ? IM[view + '_dark'] : IM[`${view}_${Math.min(14, k)}`]; }
function seq(view, t, t0, t1, z, cx, cy) { // lights climb from the first step to the top between t0 and t1
  const f = clamp((t - t0) / (t1 - t0)) * 14, k = Math.floor(f), fr = f - k;
  bgImg(seqImg(view, k), 1, z, cx, cy); if (k < 14 && fr > 0) bgImg(seqImg(view, k + 1), E.out(fr), z, cx, cy);
}
// footprint icon
function foot(x, y, s, a, rot = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = C.o2; ctx.shadowColor = C.o; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 36, 12, 13, 0, 0, 7); ctx.fill();
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-13 + i * 6.5, -32 - (i === 0 ? 4 : i === 1 ? 6 : 4 - i), 4.2 - i * .4, 0, 7); ctx.fill(); }
  ctx.restore();
}
// motion sensor icon with pulsing waves
function sensor(x, y, s, t, a) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 34 * s, 0, 7); ctx.fill(); ctx.fillStyle = C.o; ctx.beginPath(); ctx.arc(0, 0, 14 * s, 0, 7); ctx.fill();
  for (let i = 0; i < 3; i++) { const p = ((t * 1.2 + i / 3) % 1); ctx.strokeStyle = `rgba(255,122,53,${1 - p})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, (40 + 110 * p) * s, Math.PI * .15, Math.PI * .85); ctx.stroke(); }
  ctx.restore();
}
// cross-section of a tread with the LED profile under the nosing
function section(x, y, sc, t, t0) {
  const a = E.out(prog(t, t0, t0 + .5)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.fillStyle = 'rgba(14,11,9,.88)'; rrect(-420, -300, 840, 640, 34); ctx.fill(); ctx.strokeStyle = C.o2; ctx.lineWidth = 4; rrect(-420, -300, 840, 640, 34); ctx.stroke();
  // light cone from under the nosing down onto the riser and the tread below
  const lp = prog(t, t0 + .9, t0 + 1.6);
  if (lp > 0) { const g = ctx.createLinearGradient(0, -40, 0, 250); g.addColorStop(0, `rgba(255,214,162,${.85 * lp})`); g.addColorStop(1, 'rgba(255,214,162,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(78, -52); ctx.lineTo(130, -52); ctx.lineTo(330, 250); ctx.lineTo(70, 250); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#efe9e0'; ctx.fillRect(40, -64, 30, 314);           // riser below this tread (recessed behind the nosing)
  ctx.fillStyle = '#a06e3e'; rrect(-380, -120, 540, 56, 8); ctx.fill(); // tread with nosing overhang (ends at x=160)
  ctx.fillStyle = '#a06e3e'; rrect(40, 250, 380, 40, 6); ctx.fill();    // tread of the step below
  // aluminium channel + LED + diffuser fixed under the nosing
  ctx.fillStyle = '#9aa0a6'; ctx.fillRect(74, -64, 70, 26); ctx.fillStyle = '#0d0b0a'; ctx.fillRect(80, -64, 58, 16);
  ctx.save(); ctx.shadowColor = '#ffd6a2'; ctx.shadowBlur = 30 * lp; ctx.fillStyle = lp > 0 ? '#ffe6c4' : '#777'; ctx.fillRect(86, -52, 46, 8); ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(76, -42, 66, 6);
  // labels
  const lab = (s, lx, ly, px, py, tt0) => { const q = E.out(prog(t, tt0, tt0 + .35)); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = C.o2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lx, ly); ctx.stroke(); ctx.fillStyle = C.o2; ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fill(); txt(s, lx + (lx > 0 ? 10 : -10), ly, { size: 36, weight: 800, color: '#fff', align: lx > 0 ? 'left' : 'right' }); ctx.restore(); };
  lab('بروفايل ألمنيوم', -30, -210, 110, -60, t0 + .3);
  lab('غطا ناعم', 220, 40, 120, -39, t0 + .8);
  lab('شريط LED', -120, 120, 90, -48, t0 + 1.2);
  txt('درجة', -200, -92, { size: 34, weight: 900, color: '#fff' });
  ctx.restore();
}
function dotsVsLine(t, t0) {
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  card(90, 1300, 420, 230, 26, 1, '#ff5a4a'); card(570, 1300, 420, 230, 26, 1, GOOD);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.shadowColor = '#ffd6a2'; ctx.shadowBlur = 18; ctx.fillStyle = '#fff3dd'; ctx.beginPath(); ctx.arc(140 + i * 40, 1390, 9, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.save(); ctx.shadowColor = '#ffd6a2'; ctx.shadowBlur = 30; ctx.fillStyle = '#fff3dd'; rrect(620, 1380, 320, 20, 10); ctx.fill(); ctx.restore();
  txt('نقاط وزغللة', 300, 1475, { size: 40, weight: 900, color: '#ff8a7a' }); txt('خط ناعم ومتساوي', 780, 1475, { size: 40, weight: 900, color: GOOD });
  xMark(470, 1320, 40, prog(t, t0 + .3, t0 + .6)); checkMark(950, 1320, 40, prog(t, t0 + .5, t0 + .8), GOOD);
  ctx.restore();
}

// t-view step positions (bottom -> top) for footprints
const TSTEP = [[40, 1560], [110, 1430], [170, 1330], [255, 1244], [340, 1176], [415, 1112], [480, 1060], [545, 1012], [605, 968], [660, 928], [712, 892], [760, 858], [818, 826], [900, 798]];

function S1(t) { // 0–5.9 an ordinary staircase
  bgImg(IM.m_plain, 1, 1.04 + .05 * prog(t, 0, 6), 540, 1000); shade2();
  pop('شوف هالدرج…', 540, 520, t, .23, 5.9, { size: 96, weight: 900, color: '#fff', glow: 25 });
  sub2('عادي… صح؟', t, 1.42, 2.45, '#3a2f3f');
  sub2('نفس الدرج كل يوم', t, 2.51, 5.9, '#3a2f3f');
}
function S2(t) { // 5.9–10.7 at night it disappears
  const k = E.inOut(prog(t, 5.95, 6.9)); const z = 1.08 + .04 * prog(t, 6, 10.7);
  bgImg(IM.m_plain, 1 - k, z, 540, 1000); bgImg(IM.m_dark, 1, z, 540, 1000); if (k < 1) bgImg(IM.m_plain, 1 - k, z, 540, 1000);
  ctx.fillStyle = `rgba(5,8,18,${.25 * k})`; ctx.fillRect(0, 0, W, H); shade2();
  pop('بالليل… 🌙', 540, 500, t, 6.1, 10.7, { size: 100, weight: 900, color: '#cfd8ff', glow: 25, glowColor: '#5a6cff' });
  sub2('الدرجات ما تبين', t, 7.28, 8.7, '#2b2f45');
  if (t > 8.76) { const p = E.back(prog(t, 8.76, 9.15)); ctx.save(); ctx.translate(540, 1150); ctx.scale(p, p); ctx.fillStyle = '#ffcc33'; ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(115, 90); ctx.lineTo(-115, 90); ctx.closePath(); ctx.fill(); txt('!', 0, 30, { size: 140, weight: 900, color: '#1a1206', dir: 'ltr' }); ctx.restore(); }
  sub2('وكل خطوة فيها حذر', t, 8.76, 10.7, '#7a1f1f');
}
function S3(t) { // 10.7–13.95 one small move…
  const z = 1.12 + .1 * E.inOut(prog(t, 10.7, 13.9)); bgImg(IM.m_dark, 1, z, 540, 1100); shade2();
  ctx.fillStyle = 'rgba(8,6,5,.35)'; ctx.fillRect(0, 0, W, H);
  pop('بس خلّنا نسوي…', 540, 820, t, 11.06, 13.95, { size: 92, weight: 900, color: '#fff', glow: 25 });
  pop('حركة بسيطة ✨', 540, 960, t, 12.0, 13.95, { size: 92, weight: 900, color: C.o2, glow: 30 });
  if (t > 12.3) sparkles(t, 12.3, 14, 180, 1100, 720, 500);
}
function S4(t) { // 13.95–22.85 LED under every tread
  if (t < 16.8) {
    const z = 1.1 - .06 * prog(t, 13.95, 16.8); seq('m', t, 14.05, 16.0, z, 540, 1100);
    if (t > 14.0 && t < 14.6) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,162,${.35 * (1 - prog(t, 14.0, 14.6))})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    shade2(); title2('شريط LED مخفي', t, 14.01, 16.8, C.o2, 76); sub2('تحت كل درجة', t, 14.9, 16.8);
    if (t > 15.9) sparkles(t, 15.9, 12, 150, 650, 800, 900);
  } else {
    const z = 1.0 + .05 * prog(t, 16.8, 22.85); bgImg(IM.c_lit, 1, z, 540, 900); shade2();
    const a = E.out(prog(t, 16.95, 17.4)); for (let i = 0; i < 2; i++) arrowD([520, 330][i] * 1 + 0, [1000, 420][i], [1330, 590][i], a * (1 - prog(t, 20.8, 21.1)));
    title2('النور ينزل على الدرجة اللي تحتها', t, 16.85, 20.9, '#fff', 54);
    if (t > 21.0) { const p = E.back(prog(t, 21.0, 21.4)); ctx.save(); ctx.translate(540, 1120); ctx.scale(p, p); ctx.fillStyle = 'rgba(14,11,9,.8)'; ctx.beginPath(); ctx.arc(0, 0, 120, 0, 7); ctx.fill(); ctx.restore(); icon(IC.eyeClosed, 540, 1120, 150 * p, 1, { color: '#fff', lw: 9 }); }
    title2('ومصدر الضوء ما يبين أبد', t, 21.0, 22.85, GOOD, 58);
  }
}
function S5(t) { // 22.85–28.6 aluminium profile + diffuser, no dots
  bgImg(IM.c_lit, 1, 1.12 + .04 * prog(t, 22.85, 28.6), 540, 900); ctx.fillStyle = 'rgba(8,6,5,.55)'; ctx.fillRect(0, 0, W, H); shade2();
  title2('نركّبه داخل بروفايل', t, 23.04, 28.6, '#fff', 64, 250);
  section(540, 760, 1.05, t, 23.2);
  sub2('النور ناعم ومتساوي', t, 26.6, 27.9, C.o, '#fff', 1200);
  dotsVsLine(t, 26.7);
}
function S6(t) { // 28.6–36.1 colour temperature
  if (t < 33.6) {
    const z = 1.05; bgImg(IM.m_3000, 1, z, 540, 1050);
    const pos = lerp(1080, 540, E.inOut(prog(t, 29.6, 30.3)));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pos, H); ctx.clip(); bgImg(IM.m_2700, 1, z, 540, 1050); ctx.restore();
    if (pos < 1079) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(pos - 4, 0, 8, H); ctx.restore(); }
    shade2();
    pop('واللون؟ 🎨', 540, 330, t, 28.77, 33.6, { size: 96, weight: 900, color: '#fff', glow: 25 });
    label('2700K', 270, 560, t, 29.69, 33.6, { size: 64, bg: '#ffb867', color: '#1a1206', dir: 'ltr' });
    label('3000K', 810, 560, t, 30.67, 33.6, { size: 64, bg: '#ffe2b8', color: '#1a1206', dir: 'ltr' });
    sub2('دافي… وفخم ✨', t, 32.27, 33.6, C.amber, '#1a1206');
  } else {
    const z = 1.05 + .12 * E.inOut(prog(t, 33.6, 36.1)); bgImg(IM.c_lit, 1, z, 600, 1250); shade2();
    title2('ويبرز الرخام والخشب', t, 33.73, 36.1, C.o2, 66);
    label('خشب', 300, 1180, t, 34.3, 36.1, { size: 46, bg: '#a06e3e' }); label('رخام', 760, 980, t, 34.6, 36.1, { size: 46, bg: '#e9e1d4', color: '#1a1416' });
  }
}
function S7(t) { // 36.1–44.1 motion sensor: steps follow you
  const z = 1.04, cx = 540, cy = 960;
  if (t < 41.11) bgImg(IM.t_dark, 1, z, cx, cy); else seq('t', t, 41.11, 43.4, z, cx, cy);
  shade2();
  title2('وإذا تبي الحركة الأقوى… 🔥', t, 36.43, 38.2, '#fff', 60);
  title2('حساس حركة!', t, 38.23, 44.1, C.o2, 80);
  sensor(160, 1360, 1, t, E.out(prog(t, 38.3, 38.7)) * (1 - prog(t, 41.0, 41.4)));
  // footsteps climbing with the lights
  const n = t < 39.33 ? 0 : t < 41.11 ? 1 : 1 + Math.floor(clamp((t - 41.11) / 2.29) * 13);
  for (let i = 0; i < n; i++) { const [x, y] = TSTEP[i]; const age = i === n - 1 ? 1 : Math.max(.25, 1 - (n - 1 - i) * .18); foot(x + (i % 2 ? 26 : -26) * .8 + 30, y - 40, .7 - i * .025, age * E.out(prog(t, i ? 41.11 + (i - 1) * .176 : 39.33, (i ? 41.11 + (i - 1) * .176 : 39.33) + .2)), -.6); }
  sub2('تحط رجلك على أول درجة…', t, 39.33, 41.05, '#3a2f3f');
  sub2('والدرجات تشتغل معاك 👣', t, 41.11, 44.1, C.o);
}
function S8(t) { // 44.1–48.6 safety + the best piece in the house
  const k = E.inOut(prog(t, 45.6, 46.6)); bgImg(IM.m_3000, 1, 1.02 + .05 * prog(t, 44.1, 48.6), 540, 1000); bgImg(IM.s_lit, k, 1.06, 540, 960); shade2();
  label('أمان بالليل', 540, 330, t, 44.39, 45.6, { size: 72, bg: GOOD, color: '#06210f' });
  checkMark(800, 330, 46, prog(t, 44.7, 45.1), GOOD);
  title2('وأحلى قطعة في البيت ✨', t, 45.8, 48.6, C.o2, 70);
  if (t > 46.2) sparkles(t, 46.2, 16, 120, 500, 840, 900);
}
function stairPlan(x, y, w, h, t, t0) { // simple plan drawing of a straight flight with LED lines
  ctx.save(); ctx.fillStyle = '#f7f3ed'; rrect(x, y, w, h, 26); ctx.fill(); ctx.clip();
  ctx.strokeStyle = '#2a221c'; ctx.lineWidth = 6; ctx.strokeRect(x + 120, y + 110, w - 240, h - 220);
  for (let i = 1; i < 14; i++) { const yy = y + 110 + (h - 220) * i / 14; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 120, yy); ctx.lineTo(x + w - 120, yy); ctx.stroke(); const q = prog(t, t0 + i * .06, t0 + .3 + i * .06); if (q > 0) { ctx.save(); ctx.strokeStyle = C.o; ctx.lineWidth = 7; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.moveTo(x + 135, yy - 6); ctx.lineTo(x + 135 + (w - 270) * q, yy - 6); ctx.stroke(); ctx.restore(); } }
  ctx.fillStyle = '#2a221c'; ctx.beginPath(); ctx.moveTo(x + w / 2, y + 130); ctx.lineTo(x + w / 2 - 22, y + 175); ctx.lineTo(x + w / 2 + 22, y + 175); ctx.fill();
  txt('UP', x + w / 2, y + 205, { size: 30, weight: 900, color: '#2a221c', dir: 'ltr' });
  ctx.restore();
}
function S9(t) { // 48.6–55.5 QUALITY LIGHT designs it, fee deducted
  bgImg(IM.m_3000, 1, 1.12, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  const lp = prog(t, 48.96, 49.4); glow(540, 290, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 290, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 450, 270, { alpha: prog(t, 49.2, 49.8) });
  if (t < 53.0) {
    pop('نصمم إضاءة الدرج كاملة', 540, 590, t, 50.06, 53.0, { size: 64, weight: 900, color: '#fff', glow: 20 });
    const c = E.out(prog(t, 50.2, 50.7)); if (c > 0) {
      const x = 140, y = 690, w = 800, h = 900; ctx.save(); ctx.globalAlpha *= c; stairPlan(x, y, w, h, t, 50.8); ctx.restore();
      const wp = E.inOut(prog(t, 51.8, 52.7)); if (wp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * wp, h); ctx.clip(); imgCard(IM.m_3000, x, y, w, h, { r: 26, shadow: false, sx: 90, sy: 420, sw: 900, sh: 1012 }); ctx.restore(); if (wp < 1) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(x + w * wp - 4, y, 8, h); ctx.restore(); } }
      label('من المخطط… لين الواقع', 540, 1660, t, 50.9, 53.0, { size: 46, bg: GOOD, color: '#06210f' });
    }
  } else {
    const q = E.back(prog(t, 53.06, 53.5)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, 53.7, 54.2); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1120, t, 54.0, 55.5, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S10(t) { // 55.5–end address, WhatsApp, sign-off
  bgImg(IM.m_3000, 1, 1.05 + .03 * prog(t, 55.5, 64), 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 55.75, 56.15)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, 55.75, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, 56.41, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, 58.89, 59.3)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, 60.46, 60.9); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, 60.6, 61.1) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, 61.5, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, 61.9, 62.4) });
  if (t > 61.7) sparkles(t, 61.7, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, 5.9, S1, .7], [5.9, 10.7, S2, .4], [10.7, 13.95, S3, .5], [13.95, 22.85, S4, .9], [22.85, 28.6, S5, .9], [28.6, 36.1, S6, 1], [36.1, 44.1, S7, .8], [44.1, 48.6, S8, 1], [48.6, 55.5, S9, .9], [55.5, 64.2, S10, 1]];
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < 48.5) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  finish(t);
  if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, W, H); }
  if (t > 63.6) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - 63.6) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  IM.m_plain = await load('r/ST_m_plain.jpg'); IM.m_dark = await load('r/ST_m_dark.jpg'); IM.t_dark = await load('r/ST_t_dark.jpg');
  for (let k = 1; k <= 14; k++) { IM['m_' + k] = await load(`r/ST_m_lit-${k}-3000.jpg`); IM['t_' + k] = await load(`r/ST_t_lit-${k}-3000.jpg`); }
  IM.m_3000 = IM.m_14; IM.m_2700 = await load('r/ST_m_lit-14-2700.jpg');
  IM.c_lit = await load('r/ST_c_lit-14-3000.jpg'); IM.c_dark = await load('r/ST_c_dark.jpg'); IM.s_lit = await load('r/ST_s_lit-14-3000.jpg');
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
