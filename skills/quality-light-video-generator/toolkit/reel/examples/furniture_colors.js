// ---------- colours: why furniture changes colour under different light ----------
const CROPM = { sx: 40, sy: 520, sw: 1000, sh: 1410 }; // sofa area in the main view
function card2(t, t0, im, x, y, lab, col, mk, i = 0, w = 450, h = 635) {
  const p = E.back(prog(t, t0, t0 + .45)); if (p <= 0) return;
  ctx.save(); ctx.translate(x, y + h / 2); ctx.scale(p, p);
  imgCard(IM[im], -w / 2, -h / 2, w, h, { r: 28, ...CROPM }); ctx.strokeStyle = col; ctx.lineWidth = 8; rrect(-w / 2, -h / 2, w, h, 28); ctx.stroke();
  if (mk) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(w / 2 - 50, -h / 2 + 50, 40, 0, 7); ctx.fill(); txt(mk, w / 2 - 50, -h / 2 + 54, { size: 50, weight: 900, color: '#fff', dir: 'ltr' }); }
  ctx.restore(); if (lab) label(lab, x, y + h + 70, t, t0 + .2, 0, { size: 44, bg: col, color: col === GOOD ? '#06210f' : '#fff' });
}
function badge(t, n, t0, s) { // numbered reason badge
  const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return;
  ctx.save(); ctx.translate(540, 250); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  txt(String(n), 0, 6, { size: 76, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore();
  label(s, 540, 395, t, t0 + .15, 0, { size: 58, bg: 'rgba(18,14,12,.88)' });
}
const SPEC = ['#7b2cff', '#2c5bff', '#13b5c9', '#2ec44a', '#d6e02a', '#ffb21f', '#ff6a1f', '#e3172b'];
function spectrum(x, y, w, h, t, t0, gap) { // rainbow bar; gap>0 knocks out the red end
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(x, 0, x + w, 0); SPEC.forEach((c, i) => g.addColorStop(i / (SPEC.length - 1), c));
  ctx.fillStyle = g; rrect(x, y, w, h, h / 2); ctx.fill();
  if (gap > 0) { ctx.fillStyle = 'rgba(20,16,14,.92)'; ctx.fillRect(x + w * (1 - .3 * gap), y - 4, w * .3 * gap + 2, h + 8); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.strokeRect(x + w * .7, y - 8, w * .3, h + 16); ctx.setLineDash([]); }
  ctx.restore();
}
function rayDiagram(t, t0) { // lamp -> sofa -> eye
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(90, 560, 900, 760, 40); ctx.fill();
  // lamp
  ctx.fillStyle = '#2a2420'; rrect(170, 620, 140, 60, 14); ctx.fill(); glow(240, 700, 90, '#fff3dd', .7); ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(240, 690, 22, 0, 7); ctx.fill();
  // sofa
  ctx.fillStyle = '#e3cfae'; rrect(380, 1080, 380, 110, 26); ctx.fill(); rrect(380, 1010, 380, 90, 26); ctx.fill(); ctx.fillStyle = '#b3262b'; rrect(410, 990, 90, 80, 16); ctx.fill();
  // eye
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(860, 760, 70, 40, 0, 0, 7); ctx.stroke(); ctx.fillStyle = '#5aa9ff'; ctx.beginPath(); ctx.arc(860, 760, 24, 0, 7); ctx.fill();
  // rays: incoming rainbow, outgoing filtered beige
  const p1 = E.inOut(prog(t, t0 + .3, t0 + 1.2)), p2 = E.inOut(prog(t, t0 + 1.4, t0 + 2.3));
  SPEC.forEach((c, i) => { const sx = 240, sy = 715, ex = 470 + i * 26, ey = 1000; ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, ex, p1), lerp(sy, ey, p1)); ctx.stroke(); });
  if (p2 > 0) { ['#e3cfae', '#d8b98e', '#f0dcc0'].forEach((c, i) => { const sx = 620 + i * 20, sy = 1000, ex = 820 + i * 15, ey = 790; ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, ex, p2), lerp(sy, ey, p2)); ctx.stroke(); }); }
  ctx.restore();
}
function gauge(x, y, t, t0, v0, v1, col) { // CRI dial 0..100
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; const v = lerp(v0, v1, E.inOut(prog(t, t0 + .3, t0 + 1.3)));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-230, -200, 460, 330, 34); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = '#3a332d'; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(0, 40, 160, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 40, 160, Math.PI, Math.PI + Math.PI * v / 100); ctx.stroke(); ctx.shadowBlur = 0;
  txt(String(Math.round(v)), 0, 10, { size: 96, weight: 900, color: '#fff', dir: 'ltr' }); txt('CRI', 0, 95, { size: 40, weight: 800, color: '#cbbfb0', dir: 'ltr' });
  ctx.restore();
}
function tip(t, t0, y, big, small, col) {
  const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(18,14,12,.92)'; rrect(-420, -95, 840, 190, 40); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; rrect(-420, -95, 840, 190, 40); ctx.stroke();
  txt(big, 250, 4, { size: 66, weight: 900, color: col, dir: 'ltr' }); txt(small, -120, 4, { size: 50, weight: 900, color: '#fff' }); ctx.restore();
}

function S1(t) { // 0–3.9 bought a beige sofa: in the showroom it was gorgeous
  bgImg(IM.m_show, 1, 1.03 + .04 * prog(t, 0, 3.9), 540, 1000); shade2();
  pop('شريت كنبة لونها بيج 🛋️', 540, 360, t, .22, 3.9, { size: 80, weight: 900, color: '#fff', glow: 25 });
  sub2('بالمعرض كانت تجنن 😍', t, 2.11, 3.9, C.o);
  if (t > 2.3) sparkles(t, 2.3, 10, 140, 900, 800, 400);
}
function S2(t) { // 3.9–9.5 at home: grey? yellow?
  if (t < 6.43) bgImg(IM.m_warm, 1, 1.03, 540, 1000);
  else keyed(t, [[6.43, 'm_cold'], [8.13, 'm_yellow']], 1.04 + .04 * prog(t, 6.43, 9.5), 540, 1000, .35);
  shade2();
  title2('بس أول ما حطيتها بالبيت… 🏠', t, 4.16, 9.5, '#fff', 62);
  if (t >= 6.43 && t < 8.13) pop('صارت رمادية؟! 😳', 540, 1600, t, 6.43, 8.13, { size: 84, weight: 900, color: '#cfe0ff', glow: 25, glowColor: '#5a7cff' });
  if (t >= 8.13) pop('أو صفرا؟! 😬', 540, 1600, t, 8.13, 9.5, { size: 84, weight: 900, color: '#ffc46b', glow: 25 });
}
function S3(t) { // 9.5–13.7 the sofa didn't change, the light did
  bgImg(IM.m_show, 1, 1.1, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H);
  pop('لا… الكنبة ما تغيّرت ✋', 540, 420, t, 9.76, 13.7, { size: 76, weight: 900, color: '#fff', glow: 25 });
  const w = 300, h = 420; [['m_cold', 210], ['m_show', 540], ['m_yellow', 870]].forEach(([k, x], i) => { const p = E.back(prog(t, 10.0 + i * .2, 10.4 + i * .2)); if (p <= 0) return; ctx.save(); ctx.translate(x, 900); ctx.scale(p, p); imgCard(IM[k], -w / 2, -h / 2, w, h, { r: 22, sx: 140, sy: 760, sw: 820, sh: 1150 }); ctx.restore(); });
  if (t >= 11.69) pop('اللي تغيّر هو الضو 💡', 540, 1360, t, 11.69, 13.7, { size: 84, weight: 900, color: C.o2, glow: 30 });
}
function S4(t) { // 13.7–21.2 colour = the light that bounces back
  bgImg(IM.m_show, 1, 1.12, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  title2('اللون اللي تشوفه… 👁️', t, 14.05, 21.2, '#fff', 66, 330);
  if (t < 17.9) { rayDiagram(t, 14.3); label('هو الضو اللي يرتد من القطعة لعيونك', 540, 1430, t, 15.52, 17.9, { size: 48, bg: C.o }); }
  else {
    spectrum(140, 820, 800, 90, t, 17.92, 0);
    pop('فلو الضو ناقص لون…', 540, 680, t, 17.92, 21.2, { size: 64, weight: 900, color: '#fff' });
    spectrum(140, 1020, 800, 90, t, 18.4, E.out(prog(t, 18.6, 19.2)));
    label('القطعة بعد تخسره ❌', 540, 1300, t, 19.44, 21.2, { size: 56, bg: C.red });
  }
}
function S5(t) { // 21.2–31.2 reason 1: colour temperature, cold 6500K
  if (t < 24.79) { bgImg(IM.m_show, 1, 1.1, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H); badge(t, 1, 21.74, 'درجة حرارة اللون 🌡️'); return; }
  keyed(t, [[24.79, 'm_show'], [25.0, 'm_cold']], 1.04, 540, 1000, .5);
  if (t > 27.9) { const z = lerp(1, 1.0, 0); bgImg(IM.c_cold, E.out(prog(t, 27.9, 28.4)), 1.03 + .03 * prog(t, 27.9, 31.2), 540, 960); }
  shade2();
  title2('الأبيض البارد ❄️', t, 24.79, 31.2, '#cfe0ff', 62);
  if (t < 27.9) pop('6500K', 540, 1550, t, 25.4, 27.9, { size: 120, weight: 900, color: '#a9c2ff', glow: 30, glowColor: '#5a7cff' });
  sub2('الخشب يطلع باهت 🪵', t, 27.99, 29.5, '#2b2f45', '#fff', 1560);
  sub2('والبيج يميل للرمادي 🩶', t, 29.53, 31.2, '#2b2f45', '#fff', 1680);
}
function S6(t) { // 31.2–36.6 warm 3000K brings out wood, leather, fabrics
  keyed(t, [[31.2, 'c_cold'], [31.6, 'c_warm']], 1.03 + .04 * prog(t, 31.2, 36.6), 540, 960, .6); flash(t, 31.6, .18); shade2();
  title2('والضو الدافي 🔥', t, 31.5, 36.6, C.amber, 66);
  pop('3000K', 540, 520, t, 32.1, 36.6, { size: 110, weight: 900, color: C.amber, glow: 30 });
  ['الخشب 🪵', 'الجلد 🧳', 'الأقمشة 🧶'].forEach((s, i) => label(s, [800, 540, 280][i], 1620, t, 33.9 + i * .5, 0, { size: 50, bg: C.o }));
  if (t > 34) sparkles(t, 34, 12, 140, 800, 800, 600);
}
function S7(t) { // 36.6–45.6 reason 2: CRI; cheap lamp 80 or less
  if (t < 39.63) { bgImg(IM.m_warm, 1, 1.1, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H); badge(t, 2, 36.97, 'مؤشر الألوان 🌈'); label('CRI', 540, 520, t, 38.04, 0, { size: 56, bg: C.o }); return; }
  keyed(t, [[39.63, 'c_warm'], [39.9, 'c_lowcri']], 1.04, 540, 960, .5); shade2();
  title2('اللمبة الرخيصة 💸', t, 39.63, 45.6, '#fff', 62);
  if (t < 42.6) gauge(540, 1500, t, 40.2, 100, 80, C.red);
  if (t >= 42.64) { label('الأحمر يطلع طافي 🔴', 540, 1560, t, 42.64, 0, { size: 52, bg: C.red }); }
  if (t >= 44.14) label('والخشب يطلع ميت 🪵', 540, 1690, t, 44.14, 0, { size: 52, bg: '#3a2f3f' });
}
function S8(t) { // 45.6–51.7 CRI 90+: true colours like daylight
  const k = E.inOut(prog(t, 46.0, 47.3)); bgImg(IM.c_warm, 1, 1.04, 540, 960);
  if (k < 1) { const pos = 1080 * (1 - k); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pos, H); ctx.clip(); bgImg(IM.c_lowcri, 1, 1.04, 540, 960); ctx.restore(); if (k > 0) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(pos - 4, 0, 8, H); ctx.restore(); } }
  shade2();
  title2('بس لو المؤشر 90 وفوق ✅', t, 45.94, 51.7, '#fff', 62);
  if (t < 47.9) gauge(540, 1500, t, 46.1, 80, 95, GOOD);
  if (t >= 47.98) label('الألوان تطلع على حقيقتها 🎨', 540, 1560, t, 47.98, 0, { size: 52, bg: GOOD, color: '#06210f' });
  if (t >= 49.97) label('مثل ضو النهار ☀️', 540, 1690, t, 49.97, 0, { size: 52, bg: C.o });
  if (t > 48.1) sparkles(t, 48.1, 12, 140, 700, 800, 700);
}
function S9(t) { // 51.7–57.7 mistake 3: mixing colour temperatures
  bgImg(IM.m_mixed, 1, 1.04 + .05 * prog(t, 51.7, 57.7), 540, 1000); shade2();
  badge(t, 3, 52.02, 'الغلطة الثالثة ⚠️');
  label('تخلط ألوان إضاءة بنفس الغرفة', 540, 540, t, 53.41, 0, { size: 52, bg: C.red });
  if (t > 53.6) { const a = E.out(prog(t, 53.6, 54.0)); ctx.save(); ctx.globalAlpha *= a; ctx.font = '900 54px Cairo'; ctx.textAlign = 'center'; ctx.fillStyle = '#a9c2ff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 12; ctx.fillText('❄️ بارد', 300, 760); ctx.fillStyle = '#ffb15a'; ctx.fillText('🔥 دافي', 780, 760); ctx.restore(); }
  if (t >= 55.62) pop('نفس الكنبة… بلونين! 😵', 540, 1600, t, 55.62, 57.7, { size: 74, weight: 900, color: '#fff', glow: 25 });
}
function S10(t) { // 57.7–65.8 tips
  bgImg(IM.m_warm, 1, 1.1, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  pop('نصيحتي 💡', 540, 380, t, 57.99, 65.8, { size: 92, weight: 900, color: C.o2, glow: 30 });
  tip(t, 58.95, 700, '3000K', 'الصالة وغرف النوم 🛋️', C.amber);
  tip(t, 61.36, 950, '4000K', 'المطبخ 🍳', '#fff1de');
  tip(t, 62.93, 1200, 'CRI 90+', 'بكل مكان ✅', GOOD);
}
function S11(t) { // 65.8–74.5 QUALITY LIGHT: light that shows true colour; fee deducted
  bgImg(IM.m_warm, 1, 1.12, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  const lp = prog(t, 66.1, 66.6); glow(540, 300, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 300, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 460, 270, { alpha: prog(t, 66.4, 67.0) });
  if (t < 70.8) {
    pop('نختار لك الإضاءة اللي تبيّن', 540, 620, t, 67.0, 70.8, { size: 56, weight: 900, color: '#fff' });
    pop('أثاثك بلونه الحقيقي 🛋️', 540, 710, t, 68.3, 70.8, { size: 60, weight: 900, color: C.o2, glow: 20 });
    const c = E.out(prog(t, 68.6, 69.1)); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; imgCard(IM.c_warm, 190, 820, 700, 760, { r: 30, sx: 60, sy: 500, sw: 960, sh: 1040 }); ctx.restore(); }
  } else {
    const q = E.back(prog(t, 70.88, 71.3)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, 71.8, 72.3); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1120, t, 72.6, 74.5, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S12(t) { // 74.5–end address, WhatsApp, sign-off
  bgImg(IM.c_warm, 1, 1.05 + .03 * prog(t, 74.5, 80.6), 540, 960); ctx.fillStyle = 'rgba(8,6,5,.76)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 74.63, 75.0)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, 74.8, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, 75.4, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, 77.05, 77.45)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, 77.9, 78.3); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, 78.0, 78.5) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, 78.44, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, 79.0, 79.5) });
  if (t > 78.6) sparkles(t, 78.6, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, 3.9, S1, .7], [3.9, 9.5, S2, .4], [9.5, 13.7, S3, .5], [13.7, 21.2, S4, .7], [21.2, 31.2, S5, .8], [31.2, 36.6, S6, .9], [36.6, 45.6, S7, .8], [45.6, 51.7, S8, .9], [51.7, 57.7, S9, .8], [57.7, 65.8, S10, .9], [65.8, 74.5, S11, .9], [74.5, 80.6, S12, 1]];
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < 65.6) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  finish(t);
  if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, W, H); }
  if (t > 80.0) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - 80.0) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of ['m_show', 'm_cold', 'm_warm', 'm_yellow', 'm_mixed', 'm_lowcri', 'c_show', 'c_cold', 'c_warm', 'c_yellow', 'c_lowcri']) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
