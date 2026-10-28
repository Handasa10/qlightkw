// ---------- accent: one focused spot transforms a corner ----------
const CROP = { sx: 150, sy: 230, sw: 780, sh: 1100 }; // painting area in the close renders
function versus(t, t0, a, b, la, lb, ca = C.red, cb = GOOD, y = 640) { // two cards side by side, bad (left) vs good (right)
  [[a, la, ca, 300, '✗'], [b, lb, cb, 780, '✓']].forEach(([im, lab, col, x, mk], i) => {
    const p = E.back(prog(t, t0 + i * .35, t0 + .45 + i * .35)); if (p <= 0) return;
    const w = 450, h = 635; ctx.save(); ctx.translate(x, y + h / 2); ctx.scale(p, p);
    imgCard(IM[im], -w / 2, -h / 2, w, h, { r: 28, ...CROP }); ctx.strokeStyle = col; ctx.lineWidth = 8; rrect(-w / 2, -h / 2, w, h, 28); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(w / 2 - 50, -h / 2 + 50, 40, 0, 7); ctx.fill(); txt(mk, w / 2 - 50, -h / 2 + 54, { size: 50, weight: 900, color: '#fff', dir: 'ltr' });
    ctx.restore(); label(lab, x, y + h + 70, t, t0 + .2 + i * .35, 0, { size: 44, bg: col, color: i ? '#06210f' : '#fff' });
  });
}
function beamGauge(x, y, t, t0, deg0, deg1) { // a wedge that narrows from deg0 to deg1
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; const d = lerp(deg0, deg1, E.inOut(prog(t, t0 + .4, t0 + 1.6)));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(18,14,12,.88)'; rrect(-300, -60, 600, 520, 34); ctx.fill();
  const r = 400, h = d / 2 * Math.PI / 180; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, 'rgba(255,214,160,.95)'); g.addColorStop(1, 'rgba(255,214,160,.05)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, Math.PI / 2 - h, Math.PI / 2 + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a1a'; rrect(-50, -40, 100, 50, 12); ctx.fill(); ctx.fillStyle = '#fff3dd'; ctx.shadowColor = '#ffd6a0'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(0, 8, 20, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = C.o; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 150, Math.PI / 2 - h, Math.PI / 2 + h); ctx.stroke();
  txt(Math.round(d) + '°', 0, 230, { size: 70, weight: 900, color: '#fff', dir: 'ltr' });
  ctx.restore();
}
function angleDiagram(x, y, t, t0) { // ceiling + wall + spot aimed 30° off vertical
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; const s = E.inOut(prog(t, t0 + .3, t0 + 1.2));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-320, -230, 640, 470, 34); ctx.fill();
  ctx.strokeStyle = '#d8cbb8'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-260, -170); ctx.lineTo(220, -170); ctx.lineTo(220, 200); ctx.stroke(); // ceiling + wall (right)
  ctx.fillStyle = '#1f3a4f'; ctx.fillRect(206, -40, 14, 150); ctx.fillStyle = C.o; ctx.fillRect(206, -10, 14, 60); // painting on the wall
  const sx = -40, sy = -170, ang = lerp(0, 30, s) * Math.PI / 180, L = 300; const ex = sx + Math.sin(ang) * L * 1.15, ey = sy + Math.cos(ang) * L;
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([12, 12]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + 320); ctx.stroke(); ctx.setLineDash([]);
  const g = ctx.createLinearGradient(sx, sy, ex, ey); g.addColorStop(0, 'rgba(255,214,160,.9)'); g.addColorStop(1, 'rgba(255,214,160,.1)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); const sp = .2; ctx.lineTo(sx + Math.sin(ang - sp) * L * 1.2, sy + Math.cos(ang - sp) * L * 1.1); ctx.lineTo(sx + Math.sin(ang + sp) * L * 1.2, sy + Math.cos(ang + sp) * L * 1.1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(sx, sy + 8, 22, 0, 7); ctx.fill(); ctx.fillStyle = '#fff3dd'; ctx.beginPath(); ctx.arc(sx, sy + 14, 10, 0, 7); ctx.fill();
  ctx.strokeStyle = C.o; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, 120, Math.PI / 2 - ang, Math.PI / 2); ctx.stroke();
  txt(Math.round(lerp(0, 30, s)) + '°', sx + 70, sy + 175, { size: 58, weight: 900, color: C.o, dir: 'ltr' });
  ctx.restore();
}
function cctBar(x, y, t, t0) { // 2700K .. 6500K bar with a marker on 3000K
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const g = ctx.createLinearGradient(-380, 0, 380, 0); g.addColorStop(0, '#ffb35c'); g.addColorStop(.35, '#ffe2b8'); g.addColorStop(.65, '#fff8ee'); g.addColorStop(1, '#bcd4ff');
  ctx.fillStyle = g; rrect(-380, -30, 760, 60, 30); ctx.fill();
  txt('2700K', -330, 80, { size: 34, weight: 800, color: '#ffcf96', dir: 'ltr' }); txt('6500K', 330, 80, { size: 34, weight: 800, color: '#bcd4ff', dir: 'ltr' });
  const mx = lerp(300, -300, E.inOut(prog(t, t0 + .3, t0 + 1.3))); ctx.fillStyle = '#fff'; ctx.shadowColor = C.o; ctx.shadowBlur = 25; ctx.beginPath(); ctx.arc(mx, 0, 42, 0, 7); ctx.fill(); ctx.strokeStyle = C.o; ctx.lineWidth = 8; ctx.stroke();
  ctx.restore();
}
function dimmer(x, y, t, v, a) { // horizontal slider
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-380, -80, 760, 160, 80); ctx.fill();
  ctx.fillStyle = '#3a332d'; rrect(-300, -12, 600, 24, 12); ctx.fill();
  const g = ctx.createLinearGradient(-300, 0, 300, 0); g.addColorStop(0, '#6b4a2a'); g.addColorStop(1, '#ffd6a0'); ctx.fillStyle = g; rrect(-300, -12, 600 * v, 24, 12); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.shadowColor = '#ffd6a0'; ctx.shadowBlur = 20 + 30 * v; ctx.beginPath(); ctx.arc(-300 + 600 * v, 0, 38, 0, 7); ctx.fill();
  ctx.shadowBlur = 0; txt('💡', -345, 4, { size: 40, dir: 'ltr', alpha: .5 }); txt('💡', 345, 4, { size: 48, dir: 'ltr' });
  ctx.restore();
}
function ring(x, y, rx, ry, t, t0, t1, col = C.amber) { if (t < t0 || (t1 && t > t1)) return; const a = E.out(prog(t, t0, t0 + .4)); ctx.save(); ctx.globalAlpha *= a * (.65 + .35 * Math.sin(t * 5)); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.stroke(); ctx.restore(); }

function S1(t) { // 0–4.15 a corner with a nice painting / decor piece
  if (t < 2.6) bgImg(IM.w_dark, 1, 1.02 + .04 * prog(t, 0, 2.6), 540, 900);
  else bgImg(IM.v_dark, 1, 1.0 + .04 * prog(t, 2.6, 4.15), 540, 900);
  shade2();
  pop('عندك ركن بالبيت…', 540, 360, t, .05, 4.15, { size: 88, weight: 900, color: '#fff', glow: 25 });
  sub2('فيه لوحة حلوة 🖼️', t, 1.5, 2.6, '#3a2f3f');
  if (t < 2.6) ring(572, 790, 235, 320, t, 1.6, 2.6);
  if (t >= 2.6) sub2('أو قطعة ديكور غالية 🏺', t, 2.6, 4.15, '#3a2f3f');
}
function S2(t) { // 4.15–7.45 nobody notices: lost in general light
  bgImg(IM.w_flat, 1, 1.04 + .04 * prog(t, 4.15, 7.45), 540, 900); shade2();
  title2('بس محد ينتبه لها… 😐', t, 4.32, 7.45, '#fff', 66);
  sub2('ضايعة بالضو العام', t, 5.58, 7.45, '#3a2f3f');
  if (t > 5.58) { const a = E.out(prog(t, 5.58, 6.0)); for (const [x, y] of [[300, 120], [790, 120]]) { ctx.save(); ctx.globalAlpha *= a; glow(x, y, 160, '#fff4e2', .5); ctx.restore(); } }
}
function S3(t) { // 7.45–12.75 the secret: no redecorating, one spot
  bgImg(IM.w_dark, 1, 1.1, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.72)'; ctx.fillRect(0, 0, W, H);
  pop('تبي تعرف السر؟ 🤫', 540, 520, t, 7.73, 12.75, { size: 92, weight: 900, color: '#fff', glow: 25 });
  if (t > 8.92 && t < 10.45) { pop('ما تحتاج تغيّر الديكور', 540, 800, t, 8.92, 10.45, { size: 66, weight: 900, color: '#f3dcc0' }); const s = prog(t, 9.6, 10.0); if (s > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(230, 815); ctx.lineTo(230 + 620 * s, 790); ctx.stroke(); ctx.restore(); } }
  if (t >= 10.45) {
    pop('تحتاج سبوت واحد بس', 540, 790, t, 10.45, 12.75, { size: 72, weight: 900, color: C.o2, glow: 25 });
    const p = E.back(prog(t, 10.9, 11.4)); if (p > 0) { ctx.save(); ctx.translate(540, 1150); ctx.scale(p, p); glow(0, 0, 260, C.o, .45); txt('1', 0, 20, { size: 300, weight: 900, color: '#fff', dir: 'ltr', glow: 40 }); ctx.restore(); }
    if (t > 11.5) sparkles(t, 11.5, 10, 300, 950, 480, 400);
  }
}
function S4(t) { // 12.75–17.8 spot on: light exactly on the piece, the rest calms down
  keyed(t, [[12.75, 'w_dark'], [13.15, 'w_spot']], 1.03 + .05 * prog(t, 12.75, 17.8), 540, 900, .35); flash(t, 13.15, .25);
  shade2();
  title2('السبوت المركّز 🎯', t, 13.01, 17.8, '#fff', 66);
  sub2('يحط الضو على القطعة بالضبط', t, 13.9, 15.95, C.o);
  sub2('والباقي يهدى حواليها 🌙', t, 15.97, 17.8, '#3a2f3f');
}
function S5(t) { // 17.8–20.85 suddenly the painting is the star
  const z = lerp(1.0, 1.08, E.inOut(prog(t, 17.8, 20.85)));
  bgImg(IM.c_spot, 1, z, 540, 900); flash(t, 18.04, .4); shade2();
  pop('وفجأة…', 540, 330, t, 18.04, 18.75, { size: 96, weight: 900, color: '#fff', glow: 25 });
  if (t >= 18.75) pop('اللوحة صارت نجمة المكان ⭐', 540, 330, t, 18.75, 20.85, { size: 68, weight: 900, color: C.o2, glow: 30 });
  sub2('والركن كله يتغيّر ✨', t, 19.7, 20.85, C.o);
  if (t > 18.8) sparkles(t, 18.8, 16, 160, 400, 760, 900);
}
function S6(t) { // 20.85–30.8 narrow beam 15°–24°
  if (t < 23.1) { bgImg(IM.c_spot, 1, 1.08, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.55)'; ctx.fillRect(0, 0, W, H); pop('بس خلّك ذكي بالاختيار 🧠', 540, 900, t, 21.0, 23.1, { size: 72, weight: 900, color: '#fff', glow: 25 }); return; }
  bgImg(IM.c_spot, 1, 1.1, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  title2('زاوية الشعاع ضيّقة', t, 23.12, 30.8, '#fff', 66, 300);
  if (t < 28.6) { beamGauge(540, 700, t, 23.4, 60, 24); pop('24° – 15°', 540, 1430, t, 26.24, 28.6, { size: 110, weight: 900, color: C.o, glow: 30 }); }
  else { versus(t, 28.64, 'c_wide', 'c_spot', 'ضو مشتت', 'اللوحة تبرز', C.red, GOOD, 520); }
}
function S7(t) { // 30.8–37.1 aim ~30° so no reflection or glare
  bgImg(IM.c_spot, 1, 1.1, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  title2('وجّه السبوت بزاوية ثلاثين درجة', t, 30.98, 37.1, '#fff', 58, 300);
  if (t < 33.6) angleDiagram(540, 820, t, 31.3);
  else versus(t, 33.6, 'c_bad', 'c_spot', 'انعكاس وزغللة', 'بدون انعكاس ✓', C.red, GOOD, 500);
}
function S8(t) { // 37.1–41.15 3000K warm
  keyed(t, [[37.1, 'c_cold'], [38.6, 'c_spot']], 1.06, 540, 900, .7); shade2();
  title2('ولون الإضاءة؟ 🎨', t, 37.39, 41.15, '#fff', 66);
  cctBar(540, 1500, t, 37.6);
  pop('3000K', 540, 1320, t, 38.51, 41.15, { size: 110, weight: 900, color: C.amber, glow: 30 });
  sub2('دافي ومريح ☕', t, 39.96, 41.15, C.o, '#fff', 1700);
}
function S9(t) { // 41.15–45.7 CRI 90+
  bgImg(IM.c_spot, 1, 1.1, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  title2('مؤشر ألوان 90 وفوق 🌈', t, 41.29, 45.7, '#fff', 62, 300);
  versus(t, 41.7, 'c_lowcri', 'c_spot', 'ألوان باهتة', 'ألوان حقيقية', C.red, GOOD, 500);
  if (t > 43.3) sparkles(t, 43.3, 10, 560, 520, 440, 600);
}
function S10(t) { // 45.7–49.75 dimmer: calm or bold
  const v = t < 47.13 ? lerp(1, .15, E.inOut(prog(t, 46.0, 46.9))) : .15 + .85 * (.5 + .5 * Math.sin((t - 47.13) * 2.6 - Math.PI / 2));
  bgImg(IM.c_dim, 1, 1.06, 540, 900); bgImg(IM.c_spot, clamp((v - .15) / .85), 1.06, 540, 900); shade2();
  title2('ولو حطيت ديمر 🎚️', t, 45.83, 49.75, '#fff', 66);
  dimmer(540, 1420, t, v, E.out(prog(t, 45.9, 46.3)));
  label(v < .5 ? 'هادي 🌙' : 'بارز ✨', 540, 1640, t, 47.13, 0, { size: 56, bg: v < .5 ? '#3a2f3f' : C.o });
}
function S11(t) { // 49.75–57.3 QUALITY LIGHT picks the spot + placement; fee deducted
  bgImg(IM.w_spot, 1, 1.12, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  const lp = prog(t, 49.83, 50.3); glow(540, 300, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 300, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 460, 270, { alpha: prog(t, 50.1, 50.7) });
  if (t < 54.0) {
    ['السبوت المناسب 🔦', 'مكانه 📍', 'وزاويته 📐'].forEach((s, i) => { const t0 = [51.49, 52.6, 53.2][i]; const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return; ctx.save(); ctx.translate(540, 760 + i * 190); ctx.scale(p, p); ctx.fillStyle = 'rgba(18,14,12,.92)'; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.strokeStyle = C.o; ctx.lineWidth = 5; rrect(-330, -70, 660, 140, 70); ctx.stroke(); ctx.fillStyle = C.o; ctx.beginPath(); ctx.arc(260, 0, 44, 0, 7); ctx.fill(); txt('✓', 260, 6, { size: 50, weight: 900, color: '#fff', dir: 'ltr' }); txt(s, -40, 4, { size: 54, weight: 900, color: '#fff' }); ctx.restore(); });
    label('نختار لك…', 540, 600, t, 51.49, 54.0, { size: 50, bg: C.o });
  } else {
    const q = E.back(prog(t, 54.1, 54.55)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, 55.0, 55.5); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1120, t, 56.34, 57.3, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S12(t) { // 57.3–end address, WhatsApp, sign-off
  bgImg(IM.c_spot, 1, 1.05 + .03 * prog(t, 57.3, 63.4), 540, 900); ctx.fillStyle = 'rgba(8,6,5,.76)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 57.45, 57.8)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, 57.45, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, 58.2, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, 59.56, 59.95)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, 60.5, 60.9); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, 60.6, 61.1) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, 60.91, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, 61.5, 62.0) });
  if (t > 61.0) sparkles(t, 61.0, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, 4.15, S1, .7], [4.15, 7.45, S2, .4], [7.45, 12.75, S3, .5], [12.75, 17.8, S4, .9], [17.8, 20.85, S5, .9], [20.85, 30.8, S6, .8], [30.8, 37.1, S7, .8], [37.1, 41.15, S8, .9], [41.15, 45.7, S9, .9], [45.7, 49.75, S10, .9], [49.75, 57.3, S11, .9], [57.3, 63.4, S12, 1]];
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < 49.6) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  finish(t);
  if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, W, H); }
  if (t > 62.8) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - 62.8) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of ['w_dark', 'w_flat', 'w_spot', 'w_wide', 'c_dark', 'c_flat', 'c_spot', 'c_bad', 'c_cold', 'c_lowcri', 'c_dim', 'c_wide', 'v_dark', 'v_flat', 'u_spot', 'u_dark']) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
