// ---------- garden: dark after sunset -> layered evening garden ----------
function layerBadge(t, n, t0, label0) { // numbered layer badge at the top-left
  const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return;
  ctx.save(); ctx.translate(130, 200); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  txt(String(n), 0, 5, { size: 70, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore();
  label(label0, 370, 200, t, t0 + .1, 0, { size: 50, bg: 'rgba(18,14,12,.84)' });
}
function twinkle(t, a) { if (a <= 0) return; for (let i = 0; i < 40; i++) { const x = rand(i) * 1080, y = rand(i + 50) * 560, k = .5 + .5 * Math.sin(t * (2 + rand(i + 9) * 3) + i); ctx.save(); ctx.globalAlpha *= a * k; ctx.fillStyle = '#fff'; ctx.shadowColor = '#cfe0ff'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, 2 + rand(i + 3) * 2, 0, 7); ctx.fill(); ctx.restore(); } }
function arrowUp(x, y0, y1, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.amber; ctx.fillStyle = C.amber; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = C.amber; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 + 30); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 26, y1 + 36); ctx.lineTo(x, y1); ctx.lineTo(x + 26, y1 + 36); ctx.fill(); ctx.restore(); }
function spec(x, y, t, t0, big, small, col = C.o) { // a spec tile
  const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p);
  ctx.fillStyle = 'rgba(18,14,12,.88)'; rrect(-210, -130, 420, 260, 34); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; rrect(-210, -130, 420, 260, 34); ctx.stroke();
  txt(big, 0, -20, { size: 84, weight: 900, color: col, dir: 'ltr' }); txt(small, 0, 75, { size: 38, weight: 800, color: '#fff' }); ctx.restore();
}
function sunsetSwitch(x, y, t, t0) { // a small sun sinking below a horizon and lights turning on
  const a = E.out(prog(t, t0, t0 + .4)); if (a <= 0) return; const s = clamp((t - t0 - .3) / 1.4);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.fillStyle = 'rgba(18,14,12,.88)'; rrect(-300, -150, 600, 300, 34); ctx.fill();
  ctx.beginPath(); rrect(-300, -150, 600, 300, 34); ctx.clip();
  const sk = ctx.createLinearGradient(0, -150, 0, 40); sk.addColorStop(0, s < 1 ? '#f08a4b' : '#0b1430'); sk.addColorStop(1, s < 1 ? '#ffd08a' : '#172447'); ctx.globalAlpha *= 1; ctx.fillStyle = sk; ctx.fillRect(-300, -150, 600, 190);
  ctx.fillStyle = '#ffcc55'; ctx.beginPath(); ctx.arc(0, -40 + 110 * s, 46, 0, 7); ctx.fill();
  ctx.fillStyle = '#20301a'; ctx.fillRect(-300, 40, 600, 110);
  for (let i = 0; i < 5; i++) { const on = s >= 1; ctx.fillStyle = on ? '#ffd6a2' : '#444'; ctx.shadowColor = '#ffd6a2'; ctx.shadowBlur = on ? 25 : 0; ctx.beginPath(); ctx.arc(-200 + i * 100, 90, 12, 0, 7); ctx.fill(); }
  ctx.restore();
}
function gardenPlan(x, y, w, h, t, t0) { // top view drawing with light symbols
  ctx.save(); ctx.fillStyle = '#f7f3ed'; rrect(x, y, w, h, 26); ctx.fill(); ctx.clip();
  const X = v => x + w / 2 + v * (w - 120) / 9.4, Z = v => y + 60 + (-v / 14.6) * (h - 120);
  ctx.fillStyle = '#d6e3c3'; ctx.fillRect(X(-4.7), Z(0), X(4.4) - X(-4.7), Z(-14.3) - Z(0));
  ctx.strokeStyle = '#2a221c'; ctx.lineWidth = 6; ctx.strokeRect(X(-4.7), Z(0), X(4.4) - X(-4.7), Z(-14.3) - Z(0));
  ctx.fillStyle = '#c9a47a'; ctx.fillRect(X(-2.7), Z(-10.8), X(2.7) - X(-2.7), Z(-13.9) - Z(-10.8));
  ctx.fillStyle = '#efe9e0'; for (let i = 0; i < 13; i++) { const z = -.4 - i * .78, xx = Math.sin(i * .45) * .55; ctx.fillRect(X(xx - .45), Z(z + .275), X(.9) - X(0), Z(-.55) - Z(0)); }
  ctx.fillStyle = '#7da35c'; for (const [px, pz] of [[-2.9, -6.2], [-3.3, -10.2], [3.2, -9]]) { ctx.beginPath(); ctx.arc(X(px), Z(pz), 34, 0, 7); ctx.fill(); }
  const sym = [];
  for (let i = 1; i < 13; i += 2) { const z = -.4 - i * .78, xx = Math.sin(i * .45) * .55; sym.push([xx - .85, z], [xx + .85, z]); }
  sym.push([-2.45, -5.75], [-2.85, -9.75], [3.65, -8.55]);
  for (let i = 0; i < 5; i++) sym.push([-3.9 + i * 1.95, -14.05]); for (let i = 0; i < 6; i++) sym.push([-4.55, -1.5 - i * 2.1]);
  sym.forEach(([sx, sz], i) => { const q = prog(t, t0 + i * .035, t0 + .3 + i * .035); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(X(sx), Z(sz), 11, 0, 7); ctx.fill(); ctx.restore(); });
  ctx.restore();
}

function S1(t) { // 0–6.1 a garden nobody uses after sunset
  const k = E.inOut(prog(t, 3.8, 5.6)); const z = 1.04 + .05 * prog(t, 0, 6.1);
  bgImg(IM.g_day, 1, z, 540, 1000); bgImg(IM.g_dusk, k, z, 540, 1000); shade2();
  pop('عندك حوش وحديقة…', 540, 480, t, .05, 6.1, { size: 88, weight: 900, color: '#fff', glow: 25 });
  sub2('بس قولّي بصراحة…', t, 2.3, 3.75, '#3a2f3f');
  sub2('متى آخر مرة قعدت فيها بعد المغرب؟ 🌇', t, 3.84, 6.1, C.o);
}
function S2(t) { // 6.1–13.45 darkness, nobody stays out
  if (t < 9.05 || t >= 10.3) { const z = 1.06 + .05 * prog(t, 6.1, 13.45); const k = E.inOut(prog(t, 6.15, 7.0)); bgImg(IM.g_dusk, 1 - k, z, 540, 1000); bgImg(IM.g_night, k, z, 540, 1000); }
  else bgImg(IM.p_dark, 1, 1.03, 540, 960);
  shade2();
  pop('أول ما تغيب الشمس…', 540, 480, t, 6.41, 9.0, { size: 82, weight: 900, color: '#fff', glow: 25 });
  sub2('تصير ظلمة 🌑', t, 7.76, 9.0, '#2b2f45');
  if (t >= 9.05 && t < 10.3) title2('ما تشوف الممر…', t, 9.1, 10.3, '#cfd8ff', 70);
  title2('والشجر يختفي…', t, 10.33, 13.45, '#cfd8ff', 70);
  sub2('والكل يدخل داخل 🚪', t, 11.4, 13.45, '#3a2f3f');
  if (t > 11.4) { const a = E.out(prog(t, 11.4, 11.9)); ctx.save(); ctx.globalAlpha *= a * (.6 + .4 * Math.sin(t * 5)); ctx.strokeStyle = C.amber; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(1000, 1040, 90, 210, 0, 0, 7); ctx.stroke(); ctx.restore(); }
}
function S3(t) { // 13.45–16.45 night is the best weather
  bgImg(IM.g_night, 1, 1.12 - .04 * prog(t, 13.45, 16.45), 540, 900); ctx.fillStyle = 'rgba(8,10,25,.25)'; ctx.fillRect(0, 0, W, H); twinkle(t, E.out(prog(t, 13.6, 14.4)));
  pop('مع إن أحلى جو…', 540, 820, t, 13.66, 16.45, { size: 92, weight: 900, color: '#fff', glow: 25 });
  pop('هو جو الليل 🌙', 540, 960, t, 14.99, 16.45, { size: 100, weight: 900, color: '#cfd8ff', glow: 30, glowColor: '#5a6cff' });
}
function S4(t) { // 16.45–18.75 layer by layer
  bgImg(IM.g_night, 1, 1.08, 540, 1000); ctx.fillStyle = 'rgba(8,6,5,.55)'; ctx.fillRect(0, 0, W, H);
  pop('خلّنا نشغّلها…', 540, 640, t, 16.64, 0, { size: 90, weight: 900, color: '#fff', glow: 25 });
  const names = ['الممرات', 'الشجر', 'الجدار', 'الجلسة'];
  names.forEach((n, i) => { const p = E.back(prog(t, 17.1 + i * .22, 17.45 + i * .22)); if (p <= 0) return; ctx.save(); ctx.translate(540, 820 + i * 150); ctx.scale(p, p); ctx.fillStyle = 'rgba(18,14,12,.9)'; rrect(-300, -55, 600, 110, 55); ctx.fill(); ctx.strokeStyle = C.o; ctx.lineWidth = 4; rrect(-300, -55, 600, 110, 55); ctx.stroke(); ctx.fillStyle = C.o; ctx.beginPath(); ctx.arc(230, 0, 38, 0, 7); ctx.fill(); txt(String(i + 1), 230, 4, { size: 44, weight: 900, color: '#fff', dir: 'ltr' }); txt(n, -30, 4, { size: 50, weight: 900, color: '#fff' }); ctx.restore(); });
  sub2('طبقة طبقة ✨', t, 17.3, 0, C.o);
}
function S5(t) { // 18.75–25.25 1: paths
  if (t < 20.55) { keyed(t, [[18.75, 'g_night'], [18.95, 'g_path']], 1.05, 540, 1000, .5); flash(t, 18.95, .2); }
  else keyed(t, [[20.55, 'p_path']], 1.02 + .05 * prog(t, 20.55, 25.25), 540, 960);
  shade2(); layerBadge(t, 1, 18.88, 'الممرات');
  title2('إضاءة منخفضة على الجوانب', t, 20.61, 25.25, '#fff', 58, 360);
  sub2('توريك الطريق… بدون زغللة ✓', t, 22.26, 25.25, GOOD, '#06210f');
}
function S6(t) { // 25.25–33.0 2: trees
  if (t < 26.65) { keyed(t, [[25.25, 'g_path'], [25.5, 'g_tree']], 1.05, 540, 1000, .5); flash(t, 25.5, .2); }
  else { keyed(t, [[26.65, 't_dark'], [27.3, 't_tree']], 1.02 + .05 * prog(t, 26.65, 33), 540, 960, .8); }
  shade2(); layerBadge(t, 2, 25.47, 'الشجر والنخل');
  title2('سبوت أرضي… من تحت لفوق', t, 26.71, 29.65, '#fff', 60, 360);
  arrowUp(700, 1700, 1050, E.out(prog(t, 27.3, 27.8)) * (1 - prog(t, 29.4, 29.7)));
  label('والنخلة تصير لوحة بالليل 🌴', 540, 1650, t, 29.7, 33.0, { size: 52, bg: C.o });
  if (t > 30.0) sparkles(t, 30.0, 12, 200, 300, 700, 700);
}
function S7(t) { // 33.0–37.95 3: walls
  keyed(t, [[33.0, 'w_dark'], [33.4, 'w_wall']], 1.03 + .05 * prog(t, 33, 37.95), 540, 960, .7); flash(t, 33.4, .15);
  shade2(); layerBadge(t, 3, 33.23, 'الجدار');
  title2('إضاءة تغسل الطوفة بنعومة', t, 35.13, 37.95, '#fff', 58, 360);
  sub2('وتعطي الحوش عمق', t, 37.1, 37.95, C.o);
}
function S8(t) { // 37.95–44.3 4: seating
  keyed(t, [[37.95, 's_dark'], [38.3, 's_all']], 1.03 + .06 * prog(t, 37.95, 44.3), 540, 960, .7); flash(t, 38.3, .25);
  shade2(); layerBadge(t, 4, 38.17, 'الجلسة');
  title2('إضاءة مخفية تحت الكنب', t, 38.4, 39.9, '#fff', 60, 360);
  title2('وحبال إضاءة دافية فوق 💡', t, 39.93, 44.3, C.o2, 58, 360);
  label('والقعدة صارت تنادي عليك 🛋️', 540, 1650, t, 41.84, 44.3, { size: 52, bg: C.o });
  if (t > 42.0) sparkles(t, 42.0, 14, 120, 300, 840, 600);
}
function S9(t) { // 44.3–54.5 IP65, 3000K, sunset sensor
  bgImg(IM.g_all, 1, 1.12, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.74)'; ctx.fillRect(0, 0, W, H);
  title2('مقاومة للمية والغبار 💧', t, 44.55, 54.5, '#fff', 60, 300);
  spec(300, 600, t, 46.79, 'IP65', 'مية + غبار', '#5aa9ff');
  spec(780, 600, t, 48.42, '3000K', 'لون دافي', C.amber);
  if (t > 50.6) sunsetSwitch(540, 1060, t, 50.7);
  label('حساس غروب أو تايمر ⏱️', 540, 1300, t, 50.75, 0, { size: 50, bg: 'rgba(18,14,12,.88)' });
  label('تشتغل بروحها مع المغرب 🌇', 540, 1650, t, 52.71, 0, { size: 52, bg: GOOD, color: '#06210f' });
}
function S10(t) { // 54.5–59.95 same garden: before/after
  const z = 1.04; bgImg(IM.g_all, 1, z, 540, 1000);
  const pos = lerp(1080, 0, E.inOut(prog(t, 54.8, 56.1)));
  if (pos > 1) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pos, H); ctx.clip(); bgImg(IM.g_night, 1, z, 540, 1000); ctx.restore(); ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(pos - 4, 0, 8, H); ctx.restore(); }
  shade2();
  title2('نفس الحديقة…', t, 54.75, 0, '#fff', 84, 330);
  label('بس صارت أحلى مكان بالبيت ✨', 540, 1530, t, 56.2, 0, { size: 52, bg: C.o });
  label('للقعدة والضيوف ☕', 540, 1660, t, 58.28, 0, { size: 52, bg: GOOD, color: '#06210f' });
  if (t > 56.4) sparkles(t, 56.4, 16, 120, 500, 840, 900);
}
function S11(t) { // 59.95–67.6 QUALITY LIGHT designs it, fee deducted
  bgImg(IM.g_all, 1, 1.12, 540, 900); ctx.fillStyle = 'rgba(8,6,5,.8)'; ctx.fillRect(0, 0, W, H);
  const lp = prog(t, 60.17, 60.6); glow(540, 290, 230, C.o, .4 * lp); drawImg(LOGO3D, 540, 290, 240 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 450, 270, { alpha: prog(t, 60.4, 61.0) });
  if (t < 64.2) {
    pop('نصمم إضاءة الحوش والحديقة كاملة', 540, 590, t, 60.9, 64.2, { size: 54, weight: 900, color: '#fff', glow: 20 });
    const c = E.out(prog(t, 61.1, 61.6)); if (c > 0) {
      const x = 140, y = 690, w = 800, h = 900; ctx.save(); ctx.globalAlpha *= c; gardenPlan(x, y, w, h, t, 61.5); ctx.restore();
      const wp = E.inOut(prog(t, 62.9, 63.9)); if (wp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * wp, h); ctx.clip(); imgCard(IM.g_all, x, y, w, h, { r: 26, shadow: false, sx: 60, sy: 300, sw: 960, sh: 1080 }); ctx.restore(); if (wp < 1) { ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 25; ctx.fillRect(x + w * wp - 4, y, 8, h); ctx.restore(); } }
      label('من المخطط… لين الواقع', 540, 1660, t, 62.0, 64.2, { size: 46, bg: GOOD, color: '#06210f' });
    }
  } else {
    const q = E.back(prog(t, 64.26, 64.7)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.rotate(-.05); ctx.scale(q, q); ctx.fillStyle = '#f3e6c4'; rrect(-330, -110, 660, 220, 30); ctx.fill(); txt('سعر التصميم', 0, -6, { size: 74, weight: 900, color: '#1a1416' }); const s = prog(t, 64.9, 65.4); if (s > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, 20); ctx.lineTo(-250 + 500 * s, -30); ctx.stroke(); } ctx.restore(); }
    label('ينخصم عند الشراء', 540, 1120, t, 65.3, 67.6, { size: 62, bg: GOOD, color: '#06210f' });
  }
}
function S12(t) { // 67.6–end address, WhatsApp, sign-off
  bgImg(IM.s_all, 1, 1.05 + .03 * prog(t, 67.6, 75.2), 540, 960); ctx.fillStyle = 'rgba(8,6,5,.74)'; ctx.fillRect(0, 0, W, H);
  const p = E.back(prog(t, 67.73, 68.1)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, 67.73, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, 68.81, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, 70.33, 70.75)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, 71.72, 72.1); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, 71.85, 72.35) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, 72.88, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, 73.3, 73.8) });
  if (t > 73.1) sparkles(t, 73.1, 12, 160, 1400, 760, 300);
}
const SCENES = [[0, 6.1, S1, .7], [6.1, 13.45, S2, .4], [13.45, 16.45, S3, .4], [16.45, 18.75, S4, .6], [18.75, 25.25, S5, .9], [25.25, 33.0, S6, .9], [33.0, 37.95, S7, .9], [37.95, 44.3, S8, 1], [44.3, 54.5, S9, .9], [54.5, 59.95, S10, 1], [59.95, 67.6, S11, .9], [67.6, 75.2, S12, 1]];
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .3), clamp((b - t) / .3)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < 59.8) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  finish(t);
  if (t < .15) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .15})`; ctx.fillRect(0, 0, W, H); }
  if (t > 74.6) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - 74.6) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const k of ['g_day', 'g_dusk', 'g_night', 'g_path', 'g_tree', 'g_wall', 'g_all', 'p_dark', 'p_path', 't_dark', 't_tree', 'w_dark', 'w_wall', 's_dark', 's_all']) IM[k] = await load(`r/${k}.jpg`);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
