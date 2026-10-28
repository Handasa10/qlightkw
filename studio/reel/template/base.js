let LOGO3D, WM;
function drawImg(img, x, y, w, o = {}) {
  const h = w * img.height / img.width;
  ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  if (o.glow) { ctx.shadowColor = o.glowColor || C.o; ctx.shadowBlur = o.glow; }
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
  ctx.restore();
}
const GOOD = '#5fd38a', BLUE = '#5aa9ff';

// ---------- brightness patterns ----------
function flick(t, seed = 0, rate = 13) { // erratic flicker / cut-out
  const k = Math.floor(t * rate), r = rand(k * 3.17 + seed * 11.3);
  return r < .28 ? .04 : r < .45 ? .45 : 1;
}
const ripple = (t, f = 6) => .58 + .42 * Math.sin(t * Math.PI * 2 * f);
function cycle(t, t0, on = .55, off = .35) { const u = (t - t0) % (on + off); return u < on ? 1 : .03; }

// ---------- drawing helpers ----------
// LED A-bulb, L = brightness 0..1
function bulb(x, y, r, L, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  if (L > .02) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(0, -r * .25, r * 3.2, o.col || '#FFD6A0', .55 * L); glow(0, -r * .25, r * 1.4, '#FFFFFF', .35 * L); ctx.restore(); }
  ctx.beginPath(); ctx.arc(0, -r * .25, r, Math.PI * .78, Math.PI * .22); ctx.lineTo(r * .42, r * .95); ctx.lineTo(-r * .42, r * .95); ctx.closePath();
  const g = ctx.createRadialGradient(0, -r * .3, r * .1, 0, -r * .2, r * 1.1);
  g.addColorStop(0, `rgba(255,250,238,${.18 + .82 * L})`); g.addColorStop(1, `rgba(255,214,160,${.08 + .62 * L})`);
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = r * .04; ctx.strokeStyle = `rgba(255,255,255,${.35 + .3 * (1 - L)})`; ctx.stroke();
  if (o.filament) { ctx.strokeStyle = `rgba(255,190,90,${.5 + .5 * L})`; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.moveTo(-r * .2, r * .7); ctx.lineTo(-r * .2, -r * .1); for (let i = 0; i <= 8; i++) ctx.lineTo(-r * .2 + i * r * .05, -r * .1 + (i % 2 ? -r * .12 : 0)); ctx.lineTo(r * .2, r * .7); ctx.stroke(); }
  // base
  const bg = ctx.createLinearGradient(-r * .42, 0, r * .42, 0); bg.addColorStop(0, '#8d949c'); bg.addColorStop(.5, '#e2e6ea'); bg.addColorStop(1, '#8d949c');
  ctx.fillStyle = bg; rrect(-r * .42, r * .95, r * .84, r * .42, r * .06); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = r * .03;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-r * .42, r * .95 + i * r * .105); ctx.lineTo(r * .42, r * .95 + i * r * .105 - r * .04); ctx.stroke(); }
  ctx.fillStyle = '#3a3a3e'; ctx.beginPath(); ctx.moveTo(-r * .3, r * 1.37); ctx.lineTo(r * .3, r * 1.37); ctx.lineTo(r * .12, r * 1.55); ctx.lineTo(-r * .12, r * 1.55); ctx.fill();
  ctx.restore();
}
// driver box
function driverBox(x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const col = o.bad ? C.red : (o.good ? GOOD : C.o);
  ctx.shadowColor = rgba(col, .6); ctx.shadowBlur = 40;
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#2b2730'); g.addColorStop(1, '#17151b');
  rrect(-w / 2, -h / 2, w, h, 22); ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0;
  ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke();
  // terminals
  ctx.fillStyle = '#9aa2ab';
  [-1, 1].forEach(s => { [-h * .18, h * .18].forEach(dy => { ctx.fillRect(s > 0 ? w / 2 : -w / 2 - 26, dy - 6, 26, 12); }); });
  txt('DRIVER', 0, -h * .22, { size: h * .17, weight: 900, color: C.w, dir: 'ltr', spacing: 6 });
  // heartbeat line
  const beat = o.beat ?? 0;
  ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath();
  const bw = w * .7, y0 = h * .18;
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, xx = -bw / 2 + u * bw;
    const ph = ((u - beat) % 1 + 1) % 1;
    let v = 0; if (ph > .4 && ph < .46) v = -1; else if (ph >= .46 && ph < .52) v = .9; else if (ph >= .52 && ph < .56) v = -.4;
    i ? ctx.lineTo(xx, y0 + v * h * .22) : ctx.moveTo(xx, y0 + v * h * .22);
  }
  ctx.stroke();
  ctx.restore();
}
// waveform plot fn(u) in [-1,1]
function wave(x0, y, w, h, fn, o = {}) {
  const a = o.a ?? 1, p = o.p ?? 1; if (a <= 0 || p <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke();
  ctx.strokeStyle = o.col || C.o2; ctx.lineWidth = o.lw || 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.shadowColor = o.col || C.o2; ctx.shadowBlur = 20;
  ctx.beginPath();
  const n = 160;
  for (let i = 0; i <= n * p; i++) { const u = i / n; const yy = y - fn(u) * h / 2; i ? ctx.lineTo(x0 + u * w, yy) : ctx.moveTo(x0 + u * w, yy); }
  ctx.stroke(); ctx.restore();
}
// dimmer wall plate
function dimmer(x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30;
  const g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2); g.addColorStop(0, o.old ? '#d8cfbf' : '#f4f1ec'); g.addColorStop(1, o.old ? '#a99f8d' : '#cfcac2');
  rrect(-s / 2, -s / 2, s, s, s * .1); ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0;
  const kg = ctx.createRadialGradient(-s * .06, -s * .06, s * .02, 0, 0, s * .28); kg.addColorStop(0, '#5a5560'); kg.addColorStop(1, '#232027');
  ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(0, 0, s * .26, 0, 7); ctx.fill();
  ctx.rotate(o.rot || -.6); ctx.strokeStyle = C.o2; ctx.lineWidth = s * .04; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -s * .06); ctx.lineTo(0, -s * .2); ctx.stroke();
  ctx.restore();
  if (o.label) txt(o.label, x, y + s / 2 + 44, { size: 38, weight: 800, color: o.labelCol || C.warm, alpha: a });
}
// rocker switch with optional indicator light
function rocker(x, y, s, on, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30;
  rrect(-s / 2, -s / 2, s, s, s * .1); ctx.fillStyle = '#f2efea'; ctx.fill(); ctx.shadowBlur = 0;
  rrect(-s * .26, -s * .36, s * .52, s * .72, s * .06); ctx.fillStyle = '#dcd7d0'; ctx.fill();
  const g = ctx.createLinearGradient(0, -s * .36, 0, s * .36);
  if (on) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c9c3ba'); } else { g.addColorStop(0, '#c9c3ba'); g.addColorStop(1, '#ffffff'); }
  rrect(-s * .24, -s * .34, s * .48, s * .68, s * .05); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-s * .24, 0); ctx.lineTo(s * .24, 0); ctx.stroke();
  if (o.ind) { const li = o.ind; glow(0, on ? s * .2 : -s * .2, s * .2, C.o2, .8 * li); ctx.fillStyle = mixHex('#7a4a35', '#ff8a4a', li); ctx.beginPath(); ctx.arc(0, on ? s * .2 : -s * .2, s * .035, 0, 7); ctx.fill(); }
  ctx.restore();
}
function thermo(x, y, h, v, a = 1) { // v 0..1
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  rrect(-22, -h / 2, 44, h, 22); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; ctx.stroke();
  const col = mixHex('#ffb347', '#ff3b3b', v);
  const fh = (h - 40) * v;
  ctx.fillStyle = col; rrect(-11, h / 2 - 20 - fh, 22, fh + 10, 11); ctx.fill();
  ctx.beginPath(); ctx.arc(0, h / 2, 36, 0, 7); ctx.fill(); glow(0, h / 2, 90, col, .4 * v);
  ctx.restore();
}
function heatWaves(x, y, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(C.red, .8); ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const u = i / 20, yy = y - u * 110, xx = x + k * 50 + Math.sin(u * 9 - t * 6 + k) * 10; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  ctx.restore();
}
function sparks(x, y, t, a, seed = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const k = Math.floor(t * 12);
  if (rand(k + seed * 7) > .45) {
    for (let i = 0; i < 7; i++) {
      const ang = rand(k * 9 + i + seed) * 6.28, L = 20 + rand(k * 5 + i) * 40;
      ctx.strokeStyle = rgba(i % 2 ? C.amber : '#ffffff', a); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * L, y + Math.sin(ang) * L); ctx.stroke();
    }
    glow(x, y, 60, C.amber, .7 * a);
  }
  ctx.restore();
}
function badge(n, x, y, s, col = C.o) {
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  txt(String(n), x, y + 3, { size: s * 1.1, weight: 900, color: '#fff', dir: 'ltr' });
}
function label(s, x, y, t, t0, t1, o = {}) { chip(s, x, y, t, t0, t1, { size: 40, ...o }); }
function sparkles(t, t0, n, x0, y0, w, h) {
  for (let i = 0; i < n; i++) {
    const sp = prog(t, t0 + i * .06, t0 + .6 + i * .06); if (sp <= 0 || sp >= 1) continue;
    const x = x0 + rand(i + 90) * w, y = y0 + rand(i + 91) * h, s = Math.sin(sp * Math.PI) * 26;
    ctx.fillStyle = C.amber; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * .3, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * .3, y); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x, y + s * .3); ctx.lineTo(x + s, y); ctx.lineTo(x, y - s * .3); ctx.fill();
  }
}
function header(t, n, title, tN, tT, tEnd) {
  const out = tEnd ? clamp((tEnd - t) / .25) : 1;
  const p = E.back(prog(t, tN, tN + .45));
  if (p > 0) {
    ctx.save(); ctx.globalAlpha *= out; ctx.translate(540, 250); ctx.scale(p, p);
    ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 52, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    txt(String(n), 0, 4, { size: 58, weight: 900, color: '#fff', dir: 'ltr' });
    ctx.restore();
    txt('السبب', 540, 168, { size: 32, weight: 700, color: C.g, alpha: out * Math.min(1, p) });
  }
  pop(title, 540, 360, t, tT, tEnd, { size: 82, weight: 900, color: C.w, glow: 25 });
}
function arrowR(x0, x1, y, a = 1, col = C.o2) { // arrow pointing from x0 to x1
  if (a <= 0) return;
  const s = Math.sign(x1 - x0);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - s * 14, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - s * 24, y - 15); ctx.lineTo(x1 - s * 24, y + 15); ctx.fill();
  ctx.restore();
}
function arrowD(x, y0, y1, a = 1, col = C.o2) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1 - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x - 15, y1 - 24); ctx.lineTo(x + 15, y1 - 24); ctx.fill();
  ctx.restore();
}
// row card: number/icon on right, text, drawing slot on left
function rowCard(t, t0, y, title, o = {}) {
  const p = E.back(prog(t, t0, t0 + .4)); if (p <= 0) return 0;
  ctx.save(); ctx.globalAlpha *= Math.min(1, p * 2) * (o.a ?? 1); ctx.translate(540, y); ctx.scale(p, p);
  card(-440, -(o.h || 90), 880, (o.h || 90) * 2, 34, 1, o.stroke || C.o);
  if (o.n !== undefined) badge(o.n, 380, 0, 34, o.badgeCol || C.o);
  txt(title, o.n !== undefined ? 320 : 400, o.sub ? -22 : 0, { size: o.size || 48, weight: 900, color: C.w, align: 'right' });
  if (o.sub) txt(o.sub, o.n !== undefined ? 320 : 400, 34, { size: 32, weight: 700, color: C.warm, align: 'right', dir: o.subDir || 'rtl' });
  ctx.restore();
  return p;
}
const ICD = {
  driver: ['M12 30 L88 30 L88 70 L12 70 Z', 'M2 42 L12 42', 'M2 58 L12 58', 'M88 42 L98 42', 'M88 58 L98 58', 'M24 52 L36 52 L41 40 L47 62 L53 46 L57 52 L76 52'],
  dimmer: ['M14 14 L86 14 L86 86 L14 86 Z', 'M50 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0', 'M50 50 L38 36'],
  term: ['M30 22 L70 22 L70 78 L30 78 Z', 'M50 42 m-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0', 'M43 42 L57 42', 'M4 64 L30 64', 'M70 64 L96 64'],
  warn: ['M50 8 L94 88 L6 88 Z', 'M50 36 L50 62', 'M50 74 L50.5 74'],
  search: ['M42 42 m-28 0 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0', 'M62 62 L90 90'],
  hand: ['M30 92 L30 50 C30 44 40 44 40 50 L40 22 C40 16 50 16 50 22 L50 18 C50 12 60 12 60 18 L60 24 C60 18 70 18 70 24 L70 64 C70 80 62 92 50 92 Z'],
};

