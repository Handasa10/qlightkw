// ---------- 11 things to ask the electrician before finishing (2D motion graphics, Kuwaiti voice 81 s) ----------
const L = {
  hook: .23, eleven: 2.4, regret: 4.77,
  P: [[6.5, 7.44], [12.72, 13.72], [18.03, 19.45], [24.38, 25.17], [28.71, 29.55], [33.31, 34.09], [37.93, 38.78], [44.61, 45.49], [51.28, 52.07], [57.18, 58.0], [62.65, 64.7]],
  safety: 66.96, kids: 68.22,
  ql: 70.06, help: 71.28, cta: 74.06, opp: 75.99, wa: 77.76, sign: 79.23, end: 81.6,
};
const ITEMS = [
  ['مخطط العفش', 'ولو رسمة بإيدك… والأفياش بمكانها'],
  ['منسوب الأرضية النهائي', 'عشان الارتفاعات تطلع مضبوطة'],
  ['4 خطوط احتياط', 'بالطبلون… على الأقل'],
  ['خط تكييف لكل غرفة', 'حتى لو ما بتركّب الحين'],
  ['إضاءة طوارئ', 'بالدرج والممرات'],
  ['نقاط كاميرات', 'الباب والحوش والبلكونة'],
  ['لوحة تيار خفيف', 'ومواسير بروحها بعيد عن الكهربا'],
  ['أفياش المطبخ من الحين', 'ورا الكبتات وفوق الكاونتر'],
  ['سويتشات تحويلة', 'الممرات وغرفة النوم'],
  ['مخرج للشفاط', 'المطبخ والحمامات'],
  ['قاطع التسريب الأرضي + الأرضي', '🚫 مو اختياري'],
];
const NAVY = '#0b1428', LINE = 'rgba(120,170,255,.10)', GREENC = '#3ddc84';
function bg(t, warm = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixHex(NAVY, '#1a120c', warm)); g.addColorStop(1, mixHex('#060a14', '#0b0806', warm)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; const off = (t * 18) % 60;
  for (let x = -60 + off; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = -60 + off; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const sx = ((t * 260) % (W + 800)) - 400; const sg = ctx.createLinearGradient(sx - 200, 0, sx + 200, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,190,120,.05)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
}
function stroke(col, lw) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; }
function bolt(x, y, s, a = 1, col = C.o2) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(-30, 8); ctx.lineTo(-2, 8); ctx.lineTo(-12, 60); ctx.lineTo(30, -10); ctx.lineTo(2, -10); ctx.closePath(); ctx.fill(); ctx.restore(); }
// ---- per-point diagrams, drawn around (540, 880), p = 0..1 build progress, t = time ----
const DIA = [
  (p, t) => { // furniture plan: room outline, furniture blocks drop in, socket dots appear
    stroke('#cfe3ff', 6); ctx.strokeRect(300, 640, 480, 480);
    const fur = [[330, 670, 220, 90], [330, 790, 90, 160], [600, 960, 150, 130], [560, 680, 190, 60]];
    fur.forEach(([x, y, w, h], i) => { const k = E.back(prog(p, i * .12, i * .12 + .3)); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, k); ctx.fillStyle = 'rgba(207,227,255,.18)'; stroke('#cfe3ff', 3); ctx.fillRect(x, y - (1 - k) * 40, w, h); ctx.strokeRect(x, y - (1 - k) * 40, w, h); ctx.restore(); });
    [[560, 650], [312, 860], [768, 900], [470, 1105]].forEach(([x, y], i) => { const k = E.back(prog(p, .55 + i * .1, .75 + i * .1)); if (k > 0) { ctx.fillStyle = C.o2; ctx.shadowColor = C.o2; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, 16 * k, 0, 7); ctx.fill(); ctx.shadowBlur = 0; } });
  },
  (p, t) => { // finished floor level: wall, tiles rising, laser line sweeping, socket height mark
    ctx.fillStyle = 'rgba(207,227,255,.08)'; ctx.fillRect(300, 620, 480, 500);
    const tile = prog(p, 0, .4); ctx.fillStyle = '#c9b79c'; ctx.fillRect(300, 1120 - 40 * tile, 480, 40 * tile);
    const lx = lerp(300, 780, prog(p, .3, .8)); stroke('#ff3b3b', 5); ctx.shadowColor = '#ff3b3b'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.moveTo(300, 1080); ctx.lineTo(lx, 1080); ctx.stroke(); ctx.shadowBlur = 0;
    const k = prog(p, .7, 1); if (k > 0) { stroke('#cfe3ff', 4); ctx.beginPath(); ctx.moveTo(700, 1080); ctx.lineTo(700, 940); ctx.stroke(); icon(IC.socket, 700, 900, 80, k, { color: C.o2, lw: 6 }); txt('📏', 620, 1010, { size: 50, alpha: k }); }
  },
  (p, t) => { // distribution board: rows of breakers, last four glow green as spares
    ctx.fillStyle = '#20252e'; rrect(330, 620, 420, 520, 24); ctx.fill(); stroke('#8c96a6', 4); rrect(330, 620, 420, 520, 24); ctx.stroke();
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c, x = 360 + c * 62, y = 670 + r * 150; const k = prog(p, i * .03, i * .03 + .15); if (k <= 0) continue; const spare = i >= 14; ctx.fillStyle = spare ? (prog(p, .7, .85) > 0 ? GREENC : '#3a414c') : '#e9edf2'; if (spare && prog(p, .7, .85) > 0) { ctx.shadowColor = GREENC; ctx.shadowBlur = 25; } ctx.fillRect(x, y, 46, 110 * k); ctx.shadowBlur = 0; ctx.fillStyle = '#20252e'; ctx.fillRect(x + 14, y + 40, 18, 30 * k); }
    if (p > .8) txt('احتياط ✓', 540, 1080, { size: 46, weight: 900, color: GREENC, alpha: prog(p, .8, 1) });
  },
  (p, t) => { // AC line to every room: 4 rooms, an AC unit pops on each wall with a flowing line
    for (let i = 0; i < 4; i++) { const x = 300 + (i % 2) * 250, y = 640 + Math.floor(i / 2) * 250; stroke('#cfe3ff', 4); ctx.strokeRect(x, y, 230, 230); const k = E.back(prog(p, .1 + i * .15, .35 + i * .15)); if (k > 0) { ctx.fillStyle = '#eef3f8'; rrect(x + 40, y + 20, 150 * Math.min(1, k), 40, 10); ctx.fill(); ctx.strokeStyle = 'rgba(120,200,255,.6)'; ctx.lineWidth = 3; for (let j = 0; j < 3; j++) { const o = ((t * 60 + j * 25) % 70); ctx.beginPath(); ctx.moveTo(x + 60 + j * 40, y + 70 + o); ctx.lineTo(x + 50 + j * 40, y + 90 + o); ctx.stroke(); } } }
  },
  (p, t) => { // emergency light: dark corridor, power cut flash, the emergency box lights the stairs
    const cut = prog(p, .15, .25); ctx.fillStyle = `rgba(0,0,0,${.6 * cut})`; ctx.fillRect(280, 600, 520, 560);
    stroke('#cfe3ff', 4); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(320 + i * 70, 1120 - i * 70); ctx.lineTo(390 + i * 70, 1120 - i * 70); ctx.lineTo(390 + i * 70, 1050 - i * 70); ctx.stroke(); }
    const on = prog(p, .35, .5); ctx.fillStyle = '#f2f2f2'; rrect(470, 640, 140, 50, 10); ctx.fill(); if (on > 0) { const g = ctx.createRadialGradient(540, 690, 10, 540, 690, 380); g.addColorStop(0, `rgba(255,236,190,${.55 * on})`); g.addColorStop(1, 'rgba(255,236,190,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(470, 690); ctx.lineTo(260, 1160); ctx.lineTo(820, 1160); ctx.lineTo(610, 690); ctx.fill(); ctx.fillStyle = '#ffe9bd'; ctx.fillRect(480, 668, 120, 16); }
    if (cut > 0 && on < 1) bolt(700, 700, .9, 1 - on, '#ff3b3b');
  },
  (p, t) => { // cameras: house outline, cameras at the door and the yard with sweeping view cones
    icon(IC.house, 540, 880, 420, prog(p, 0, .4), { color: '#cfe3ff', lw: 5 });
    [[380, 760, .6], [700, 1020, -.3]].forEach(([x, y, a0], i) => { const k = E.back(prog(p, .35 + i * .2, .6 + i * .2)); if (k <= 0) return; const a = a0 + Math.sin(t * 1.5 + i) * .35; ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(79,163,255,.18)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 260 * k, a - .35, a + .35); ctx.fill(); ctx.restore(); icon(IC.cam, x, y, 90, 1, { color: C.o2, lw: 6 }); });
  },
  (p, t) => { // low-current panel: router box, two conduits, power (orange) and data (blue) kept apart
    ctx.fillStyle = '#e9edf2'; rrect(420, 620, 240, 170, 16); ctx.fill(); ctx.fillStyle = '#20252e'; rrect(450, 660, 180, 60, 10); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.fillStyle = (Math.floor(t * 4) + i) % 2 ? GREENC : '#2a4'; ctx.beginPath(); ctx.arc(475 + i * 40, 690, 8, 0, 7); ctx.fill(); }
    const k = prog(p, .3, .8); [[480, BLUE], [600, C.o2]].forEach(([x, col], i) => { stroke(col, 18); ctx.beginPath(); ctx.moveTo(x, 790); ctx.lineTo(x, 790 + 360 * k); ctx.stroke(); stroke('rgba(255,255,255,.5)', 3); for (let y = 800; y < 790 + 360 * k; y += 40) { ctx.beginPath(); ctx.arc(x, y + ((t * 80) % 40), 4, 0, 7); ctx.stroke(); } });
    if (p > .7) { txt('بيانات', 480, 1200, { size: 40, weight: 900, color: BLUE, alpha: prog(p, .7, .9) }); txt('كهربا', 600, 1200, { size: 40, weight: 900, color: C.o2, alpha: prog(p, .7, .9) }); }
  },
  (p, t) => { // kitchen: base and wall cabinets, sockets appear above the counter and behind units
    ctx.fillStyle = '#6f7d73'; ctx.fillRect(300, 980, 480, 160); ctx.fillRect(300, 660, 480, 150); ctx.fillStyle = '#f1ede6'; ctx.fillRect(290, 970, 500, 16); ctx.fillStyle = 'rgba(217,209,196,.4)'; ctx.fillRect(300, 810, 480, 160);
    [[380, 890], [540, 890], [700, 890], [440, 1060], [640, 735]].forEach(([x, y], i) => { const k = E.back(prog(p, .2 + i * .12, .4 + i * .12)); if (k > 0) icon(IC.socket, x, y, 70 * k, 1, { color: C.o2, lw: 6 }); });
  },
  (p, t) => { // two-way switches: corridor with a switch at each end and a lamp that toggles from both
    stroke('#cfe3ff', 5); ctx.strokeRect(260, 820, 560, 160);
    const k = prog(p, 0, .3); icon(IC.switchP, 300, 900, 80 * k, 1, { color: C.o2, lw: 6 }); icon(IC.switchP, 780, 900, 80 * k, 1, { color: C.o2, lw: 6 });
    stroke('rgba(255,154,64,.6)', 4); ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(340, 900); ctx.lineTo(740, 900); ctx.stroke(); ctx.setLineDash([]);
    const on = p > .35 && (Math.floor((t - 0) * 1.2) % 2 === 0); icon(IC.bulb, 540, 760, 110, 1, { color: on ? '#ffd27a' : '#6a7280', lw: 6 }); if (on) glow(540, 760, 120, '#ffb347', .5);
    txt(on ? '👈' : '👉', on ? 300 : 780, 1010, { size: 50, alpha: prog(p, .35, .5) });
  },
  (p, t) => { // exhaust fan: spinning blades in a ring
    ctx.save(); ctx.translate(540, 880); stroke('#cfe3ff', 8); ctx.beginPath(); ctx.arc(0, 0, 200, 0, 7); ctx.stroke(); ctx.rotate(t * 6 * prog(p, .1, .5)); ctx.fillStyle = '#e9edf2'; for (let i = 0; i < 5; i++) { ctx.rotate(Math.PI * 2 / 5); ctx.beginPath(); ctx.ellipse(0, -95, 40, 85, .4, 0, 7); ctx.fill(); } ctx.fillStyle = C.o2; ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(200,220,255,.35)'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { const o = (t * 120 + i * 60) % 240; ctx.beginPath(); ctx.moveTo(380 + i * 110, 1140 - o); ctx.quadraticCurveTo(400 + i * 110, 1110 - o, 380 + i * 110, 1080 - o); ctx.stroke(); }
  },
  (p, t) => { // RCD + earth: a shield with a bolt, a breaker that trips, then a check
    const k = E.back(prog(p, 0, .3)); glow(540, 860, 260, '#ff3b3b', .25 * k); icon(IC.shield, 540, 860, 380 * k, 1, { color: '#ff6b5b', lw: 10 });
    bolt(540, 850, 1.3 * k, 1, '#ffb347');
    const c = prog(p, .55, .8); if (c > 0) { checkMark(540, 1160, 90, c, GREENC); }
    // earth symbol
    stroke('#cfe3ff', 6); const ex = 800, ey = 1080, e = prog(p, .3, .5); if (e > 0) { ctx.globalAlpha *= e; ctx.beginPath(); ctx.moveTo(ex, ey - 60); ctx.lineTo(ex, ey); ctx.moveTo(ex - 40, ey); ctx.lineTo(ex + 40, ey); ctx.moveTo(ex - 26, ey + 16); ctx.lineTo(ex + 26, ey + 16); ctx.moveTo(ex - 12, ey + 32); ctx.lineTo(ex + 12, ey + 32); ctx.stroke(); ctx.globalAlpha /= e; }
  },
];
function dots(i, t) { for (let k = 0; k < 11; k++) { const x = 540 + (k - 5) * 64, on = k <= i; ctx.fillStyle = on ? C.o : 'rgba(255,255,255,.18)'; if (k === i) { ctx.shadowColor = C.o; ctx.shadowBlur = 20; } ctx.beginPath(); ctx.arc(x, 300, k === i ? 16 : 11, 0, 7); ctx.fill(); ctx.shadowBlur = 0; } }
function SP(i) { // one checklist point
  return (t) => {
    const [t0, td] = L.P[i], end = i < 10 ? L.P[i + 1][0] : L.ql;
    bg(t, i === 10 ? .4 : 0);
    txt('تطلبها من الكهربائي ⚡', 540, 210, { size: 44, weight: 800, color: 'rgba(255,255,255,.7)' }); dots(i, t);
    const b = E.back(prog(t, t0, t0 + .4)); if (b > 0) { ctx.save(); ctx.translate(540, 450); ctx.scale(b, b); ctx.fillStyle = i === 10 ? '#d32f2f' : C.o; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 90, 0, 7); ctx.fill(); ctx.shadowBlur = 0; txt(String(i + 1), 0, 8, { size: 110, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
    DIA[i](prog(t, t0 + .3, Math.min(end - .3, td + 2.5)), t);
    const tp = E.out(prog(t, td - .2, td + .3)); if (tp > 0) txt(ITEMS[i][0], 540, 1330 + (1 - tp) * 30, { size: ITEMS[i][0].length > 18 ? 66 : 80, weight: 900, color: '#fff', alpha: tp, glow: 18 });
    const sp = E.out(prog(t, td + .6, td + 1.1)); if (sp > 0) label(ITEMS[i][1], 540, 1470, t, td + .6, 0, { size: 52, bg: i === 10 ? 'rgba(211,47,47,.92)' : 'rgba(18,14,12,.88)', color: '#fff' });
    if (i === 10 && t > L.kids) pop('🛡️ سلامة عيالك', 540, 1640, t, L.kids, 0, { size: 72, weight: 900, color: '#ffd27a', glow: 25 });
  };
}
function S0(t) { // hook: before the electrician starts… 11 things… or you'll regret it
  bg(t, 0);
  const k = E.back(prog(t, .1, .6)); bolt(540, 560, 2.2 * k, 1);
  pop('قبل لا يبدي الكهربائي', 540, 850, t, L.hook, 0, { size: 78, weight: 900, color: '#fff', glow: 20 });
  pop('شغله ببيتك… 🏠', 540, 960, t, L.hook + .5, 0, { size: 70, weight: 900, color: '#fff' });
  const n = Math.min(11, Math.floor(prog(t, L.eleven, L.eleven + 1.1) * 11) + (t > L.eleven ? 1 : 0)); if (t > L.eleven) { const s = E.back(prog(t, L.eleven, L.eleven + .3)); txt(String(Math.max(1, n)), 540, 1230, { size: 300, weight: 900, color: C.o2, glow: 50, scale: s, dir: 'ltr' }); txt('شغلة لازم تطلبها منه', 540, 1430, { size: 64, weight: 900, color: '#fff', alpha: prog(t, L.eleven + .4, L.eleven + .8) }); }
  if (t > L.regret) { const p = E.back(prog(t, L.regret, L.regret + .35)); ctx.save(); ctx.translate(540, 1620); ctx.rotate(-.05); ctx.scale(p, p); ctx.fillStyle = '#d32f2f'; rrect(-250, -62, 500, 124, 30); ctx.fill(); txt('ولا بتندم ❌', 0, 4, { size: 64, weight: 900, color: '#fff' }); ctx.restore(); }
}
function SQ(t) { // QUALITY LIGHT helps you choose the right light for every point
  bg(t, .6); dim(.1);
  const lp = prog(t, L.ql, L.ql + .45); glow(540, 700, 260, C.o, .45 * lp); drawImg(LOGO3D, 540, 680, 280 * lerp(.3, 1, E.back(lp)), { glow: 50, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 880, 330, { alpha: prog(t, L.ql + .3, L.ql + .8) });
  label('💡 نساعدك تختار الإضاءة الصح', 540, 1180, t, L.help, 0, { size: 58, bg: 'rgba(18,14,12,.88)', color: '#fff' });
  label('لكل نقطة ✓', 540, 1320, t, L.help + .9, 0, { size: 58, bg: GOOD, color: '#06210f' });
  label('💾 احفظ الفيديو وارسله لكهربائيك', 540, 1560, t, L.help + 1.4, 0, { size: 46, bg: C.o, color: '#fff' });
}
function SC(t) { // address, WhatsApp, sign-off
  bg(t, .6);
  const p = E.back(prog(t, L.cta + .1, L.cta + .5)); if (p > 0) { ctx.save(); ctx.translate(540, 380); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 50; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.restore(); icon(IC.pin, 540, 380, 120 * p, 1, { color: '#fff', lw: 10 }); }
  pop('حولي', 540, 590, t, L.cta + .3, 0, { size: 96, weight: 900, color: '#fff', glow: 25 });
  pop('شارع تونس – مقابل مجمع الرحاب', 540, 700, t, L.opp, 0, { size: 50, weight: 800, color: '#f3dcc0' });
  const q = E.back(prog(t, L.wa - .2, L.wa + .2)); if (q > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(q, q); ctx.fillStyle = '#25D366'; ctx.shadowColor = '#25D366'; ctx.shadowBlur = 50; rrect(-330, -70, 660, 140, 70); ctx.fill(); ctx.shadowBlur = 0; txt('+965 5111 1725', 0, 4, { size: 66, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore(); }
  const lp = prog(t, L.cta + .4, L.cta + .8); glow(540, 1180, 200, C.o, .35 * lp); drawImg(LOGO3D, 540, 1170, 200 * lerp(.3, 1, E.back(lp)), { glow: 40, alpha: Math.min(1, lp * 3) }); drawImg(WM, 540, 1310, 250, { alpha: prog(t, L.cta + .5, L.cta + 1) });
  pop('خلّ بيتك ينوّر صح ✨', 540, 1500, t, L.sign, 0, { size: 80, weight: 900, color: C.o2, glow: 30 });
  txt('@quality_light1', 540, 1640, { size: 50, weight: 900, color: '#fff', dir: 'ltr', alpha: prog(t, L.sign + .5, L.sign + 1.0) });
  if (t > L.sign) sparkles(t, L.sign, 12, 160, 1400, 760, 300);
}
function dim(a) { ctx.fillStyle = `rgba(8,6,5,${a})`; ctx.fillRect(0, 0, W, H); }
const SCENES = [[0, L.P[0][0], S0], ...L.P.map(([a], i) => [a, i < 10 ? L.P[i + 1][0] : L.ql, SP(i)]), [L.ql, L.cta, SQ], [L.cta, L.end, SC]];
function draw(t) {
  beginFrame();
  for (const [a, b, fn] of SCENES) { if (t < a || t >= b) continue; const al = Math.min(a === 0 ? 1 : clamp((t - a) / .25), clamp((b - t) / .25)); ctx.save(); ctx.globalAlpha = al; fn(t); ctx.restore(); }
  if (t > 3.0 && t < L.ql - .2) drawImg(LOGO3D, 100, 1850, 90, { alpha: .85 });
  for (const [a] of SCENES.slice(1)) sweep(t, a);
  endFrame(t);
  if (t > L.end - .6) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (L.end - .6)) / .6)})`; ctx.fillRect(0, 0, W, H); }
}
async function init() {
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
  [LOGO3D, WM] = await Promise.all([load('logo3d.png'), load('wordmark.png')]);
  for (const w of [600, 700, 800, 900]) await document.fonts.load(`${w} 60px Cairo`);
  await document.fonts.ready; makeGrain(); window.READY = true;
}
init();
