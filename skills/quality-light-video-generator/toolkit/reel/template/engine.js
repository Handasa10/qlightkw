// ===== Core helpers =====
const W = 1080, H = 1920;
const C = {
  o: '#EF5924', o2: '#FF7A35', amber: '#FFB347', warm: '#FFD9A8', bg: '#0B0A0D',
  w: '#FFF6EE', g: '#8C8792', g2: '#4A4650', dull: '#B9A957', red: '#FF3B3B', glass: 'rgba(255,255,255,0.06)',
};
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  elastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
};
function env(t, a, b, fi = .3, fo = .3) {
  if (t < a || t > b) return 0;
  return Math.min(clamp((t - a) / fi), clamp((b - t) / fo));
}
function rand(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function mixHex(h1, h2, t) {
  const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  const r = Math.round(lerp(a >> 16, b >> 16, t)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t)), bl = Math.round(lerp(a & 255, b & 255, t));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

function txt(s, x, y, o = {}) {
  const { size = 80, weight = 800, color = C.w, align = 'center', alpha = 1, scale = 1, glow = 0,
    glowColor = C.o, rot = 0, dir = 'rtl', stroke = 0, strokeColor = 'rgba(0,0,0,0.6)', spacing = 0 } = o;
  if (alpha <= 0.001 || scale <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(scale, scale);
  ctx.font = `${weight} ${size}px Cairo`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.direction = dir;
  if (spacing) ctx.letterSpacing = spacing + 'px';
  if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = strokeColor; ctx.lineJoin = 'round'; ctx.strokeText(s, 0, 0); }
  if (glow) { ctx.shadowColor = glowColor; ctx.shadowBlur = glow; }
  ctx.fillStyle = color; ctx.fillText(s, 0, 0);
  ctx.restore();
}
// Pop-in headline (scale overshoot + rise), fades out at t1
function pop(s, x, y, t, t0, t1, o = {}) {
  const p = prog(t, t0, t0 + (o.dur || .45));
  if (p <= 0) return;
  const out = t1 ? clamp((t1 - t) / .25) : 1;
  txt(s, x, y + (1 - E.out(p)) * 40, { ...o, scale: (o.scale || 1) * lerp(.5, 1, E.back(p)), alpha: (o.alpha ?? 1) * Math.min(1, p * 3) * out });
}

const _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
_svg.style.position = 'absolute'; _svg.style.width = '0'; _svg.style.height = '0';
document.body.appendChild(_svg);
const _pc = {};
function P(d) {
  if (_pc[d]) return _pc[d];
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  el.setAttribute('d', d); _svg.appendChild(el);
  return _pc[d] = { p: new Path2D(d), L: el.getTotalLength() };
}
// Stroke-draw a set of 100x100-grid paths centred on (x,y) with size s (px)
function icon(paths, x, y, s, pr = 1, o = {}) {
  if (pr <= 0) return;
  const k = s / 100;
  ctx.save();
  ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(k, k); ctx.translate(-50, -50);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = (o.lw || 6) / k;
  ctx.strokeStyle = o.color || C.w;
  if (o.glow) { ctx.shadowColor = o.glowColor || o.color || C.o; ctx.shadowBlur = o.glow; }
  for (const d of paths) {
    const { p, L } = P(d);
    if (o.fill && pr >= 1) { ctx.fillStyle = o.fill; ctx.fill(p); }
    if (pr < 1) { ctx.setLineDash([L, L + 1]); ctx.lineDashOffset = L * (1 - pr); } else ctx.setLineDash([]);
    ctx.stroke(p);
  }
  ctx.restore();
}
function glow(x, y, r, color, a) {
  if (a <= 0 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(.4, rgba(color, a * .45)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
function rrect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// Glass card
function card(x, y, w, h, r, a = 1, stroke = C.o) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rrect(x, y, w, h, r);
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, 'rgba(255,255,255,0.10)'); g.addColorStop(1, 'rgba(255,255,255,0.03)');
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = rgba(stroke, .55); ctx.stroke();
  ctx.restore();
}
// Orange pill label
function chip(s, x, y, t, t0, t1, o = {}) {
  const p = prog(t, t0, t0 + .4);
  if (p <= 0) return;
  const out = t1 ? clamp((t1 - t) / .25) : 1;
  if (out <= 0) return;
  const size = o.size || 46;
  ctx.save();
  ctx.font = `800 ${size}px Cairo`; ctx.direction = o.dir || 'rtl';
  const tw = ctx.measureText(s).width;
  const w = tw + size * 1.3, h = size * 1.75;
  ctx.globalAlpha *= Math.min(1, p * 3) * out;
  ctx.translate(x, y); const sc = lerp(.4, 1, E.back(p)); ctx.scale(sc, sc);
  ctx.shadowColor = rgba(o.bg || C.o, .7); ctx.shadowBlur = 40;
  rrect(-w / 2, -h / 2, w, h, h / 2);
  ctx.fillStyle = o.bg || C.o; ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = o.color || '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(s, 0, size * .06);
  ctx.restore();
}
function xMark(x, y, s, pr, color = C.red) {
  icon(['M20 20 L80 80', 'M80 20 L20 80'], x, y, s, pr, { color, lw: 14, glow: 25 });
}
function checkMark(x, y, s, pr, color = C.o) {
  icon(['M18 52 L40 74 L84 28'], x, y, s, pr, { color, lw: 14, glow: 25 });
}

// ===== Icon library (100x100 grid) =====
const IC = {
  bulb: ['M50 8 C29 8 17 25 17 42 C17 55 25 63 32 71 C35 75 36 78 36 82 L64 82 C64 78 65 75 68 71 C75 63 83 55 83 42 C83 25 71 8 50 8 Z', 'M38 89 L62 89', 'M42 96 L58 96'],
  filament: ['M42 82 L42 60 C42 52 58 52 58 60 L58 82', 'M42 60 C46 48 54 48 58 60'],
  house: ['M8 50 L50 14 L92 50', 'M20 41 L20 90 L80 90 L80 41', 'M42 90 L42 66 L58 66 L58 90', 'M27 52 L38 52 L38 62 L27 62 Z', 'M62 52 L73 52 L73 62 L62 62 Z'],
  crack: ['M50 14 L45 30 L55 41 L43 55 L53 68 L46 90'],
  sofa: ['M18 58 L18 42 Q18 34 26 34 L74 34 Q82 34 82 42 L82 58', 'M8 60 Q8 50 16 50 Q24 50 24 60 L24 64 L76 64 L76 60 Q76 50 84 50 Q92 50 92 60 L92 78 L8 78 Z', 'M14 78 L14 86', 'M86 78 L86 86', 'M50 40 L50 64'],
  frame: ['M10 15 L90 15 L90 85 L10 85 Z', 'M18 75 L40 45 L55 62 L65 52 L82 75 Z', 'M70 32 A6 6 0 1 1 69.9 32'],
  plant: ['M35 70 L65 70 L60 96 L40 96 Z', 'M50 70 C50 50 50 35 50 20', 'M50 55 C38 50 30 40 28 26 C42 30 49 40 50 55', 'M50 45 C60 38 70 30 74 16 C60 20 52 30 50 45', 'M50 62 C60 58 70 56 80 44 C66 44 56 50 50 62'],
  lamp: ['M30 10 L70 10 L80 36 L20 36 Z', 'M50 36 L50 90', 'M34 92 L66 92'],
  switchP: ['M14 14 L86 14 L86 86 L14 86 Z', 'M38 26 L62 26 L62 74 L38 74 Z', 'M38 50 L62 50'],
  socket: ['M14 14 L86 14 L86 86 L14 86 Z', 'M47 30 L53 30 L53 46 L47 46 Z', 'M28 58 L42 58 L42 64 L28 64 Z', 'M58 58 L72 58 L72 64 L58 64 Z'],
  intercom: ['M28 6 L72 6 Q80 6 80 14 L80 86 Q80 94 72 94 L28 94 Q20 94 20 86 L20 14 Q20 6 28 6 Z', 'M30 16 L70 16 L70 52 L30 52 Z', 'M50 66 A9 9 0 1 1 49.9 66', 'M38 84 L62 84'],
  cam: ['M10 30 L70 30 L80 40 L80 58 L10 58 Z', 'M80 44 L92 38 L92 60 L80 54', 'M40 58 L40 72 L20 88', 'M8 84 L32 92', 'M22 44 A6 6 0 1 1 21.9 44'],
  phone: ['M30 4 L70 4 Q78 4 78 12 L78 88 Q78 96 70 96 L30 96 Q22 96 22 88 L22 12 Q22 4 30 4 Z', 'M44 10 L56 10'],
  shield: ['M50 6 L86 20 L86 46 C86 70 70 86 50 96 C30 86 14 70 14 46 L14 20 Z'],
  shieldCheck: ['M33 50 L45 62 L68 38'],
  pin: ['M50 94 C50 94 18 60 18 38 C18 20 32 6 50 6 C68 6 82 20 82 38 C82 60 50 94 50 94 Z', 'M50 38 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0'],
  insta: ['M28 8 L72 8 Q92 8 92 28 L92 72 Q92 92 72 92 L28 92 Q8 92 8 72 L8 28 Q8 8 28 8 Z', 'M50 50 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0', 'M74 25 L74.5 25'],
  tel: ['M30 10 L42 30 L34 40 C40 52 48 60 60 66 L70 58 L90 70 L84 86 C50 88 12 50 14 16 Z'],
  eye: ['M6 50 C22 22 78 22 94 50 C78 78 22 78 6 50 Z', 'M50 50 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0'],
  eyeClosed: ['M10 46 C26 70 74 70 90 46', 'M22 60 L14 72', 'M40 66 L36 80', 'M60 66 L64 80', 'M78 60 L86 72'],
  bell: ['M50 10 C32 10 24 26 24 42 L24 62 L14 74 L86 74 L76 62 L76 42 C76 26 68 10 50 10 Z', 'M40 82 C42 92 58 92 60 82'],
  lockC: ['M24 46 L76 46 L76 92 L24 92 Z', 'M34 46 L34 32 C34 10 66 10 66 32 L66 46', 'M50 64 L50 76'],
  hardhat: ['M14 66 C14 40 30 24 50 24 C70 24 86 40 86 66 Z', 'M8 66 L92 66 L92 74 L8 74 Z', 'M44 24 L44 50', 'M56 24 L56 50'],
  person: ['M50 40 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0', 'M16 96 C16 70 32 62 50 62 C68 62 84 70 84 96'],
  coin: ['M50 50 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0'],
};

// ===== Backdrop =====
let grain = null;
function makeGrain() {
  grain = document.createElement('canvas'); grain.width = grain.height = 256;
  const g = grain.getContext('2d'), d = g.createImageData(256, 256);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0);
}
function backdrop(t, warmth) {
  const g = ctx.createRadialGradient(540, 850, 40, 540, 900, 1350);
  g.addColorStop(0, mixHex('#17131a', '#2a1810', warmth));
  g.addColorStop(.55, mixHex('#0d0b0f', '#140c09', warmth));
  g.addColorStop(1, '#050406');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Perspective grid floor
  ctx.save(); ctx.globalAlpha = .07 + .05 * warmth; ctx.strokeStyle = C.o; ctx.lineWidth = 1.5;
  const hy = 1340;
  for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 40, hy); ctx.lineTo(540 + i * 260, H); ctx.stroke(); }
  for (let j = 0; j < 9; j++) { const yy = hy + Math.pow(j / 8, 1.8) * (H - hy) + ((t * 30) % 20) * (j / 8); ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
  ctx.restore();
  // Bokeh
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 34; i++) {
    const sp = 14 + rand(i + 7) * 30;
    const x = rand(i) * W + Math.sin(t * .3 + i) * 40;
    let y = (rand(i + 100) * (H + 400) - t * sp) % (H + 400); if (y < 0) y += H + 400; y -= 200;
    const r = 14 + rand(i + 3) * 60;
    const a = (.03 + rand(i + 9) * .07) * (.6 + .6 * warmth) * (0.6 + 0.4 * Math.sin(t * 1.3 + i * 2));
    glow(x, y, r, i % 3 ? C.o : C.amber, a);
  }
  ctx.restore();
}
function finish(t) {
  const v = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .045; ctx.globalCompositeOperation = 'overlay';
  const ox = Math.floor(rand(Math.floor(t * 30)) * 256), oy = Math.floor(rand(Math.floor(t * 30) + 50) * 256);
  ctx.translate(-ox, -oy);
  ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W + 256, H + 256);
  ctx.restore();
}
// Diagonal light-sweep transition centred at tb
function sweep(t, tb) {
  const p = prog(t, tb - .28, tb + .32);
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.translate(540, 960); ctx.rotate(-.42);
  const x = lerp(-1500, 1500, E.inOut(p));
  const g = ctx.createLinearGradient(x - 260, 0, x + 260, 0);
  g.addColorStop(0, 'rgba(239,89,36,0)'); g.addColorStop(.42, 'rgba(255,122,53,0.55)'); g.addColorStop(.5, 'rgba(255,230,200,0.9)');
  g.addColorStop(.58, 'rgba(255,122,53,0.55)'); g.addColorStop(1, 'rgba(239,89,36,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 260, -1400, 520, 2800);
  ctx.restore();
  // brief flash
  const f = 1 - Math.abs(p - .5) * 2;
  ctx.fillStyle = `rgba(255,190,140,${.18 * f})`; ctx.fillRect(0, 0, W, H);
}

// ===== Captions =====
let WORDS = []; // per card: [{w, a, b}]
function buildCaptions() {
  WORDS = CARDS.map(ids => {
    const arr = [];
    for (const i of ids) {
      const [a, b, s] = PHRASES[i];
      const ws = s.split(' ');
      const lens = ws.map(w => w.replace(/[…،!.:]/g, '').length + 1.5);
      const tot = lens.reduce((x, y) => x + y, 0);
      let acc = 0;
      ws.forEach((w, k) => { const wa = a + (b - a) * acc / tot; acc += lens[k]; arr.push({ w, a: wa, b: a + (b - a) * acc / tot }); });
    }
    return arr;
  });
}
function captions(t) {
  for (let ci = 0; ci < CARDS.length; ci++) {
    const ws = WORDS[ci];
    const start = ws[0].a - .15;
    const lastEnd = ws[ws.length - 1].b;
    const next = ci + 1 < CARDS.length ? WORDS[ci + 1][0].a - .17 : 99;
    const end = Math.min(next, lastEnd + .7);
    if (t < start || t > end) continue;
    const a = Math.min(clamp((t - start) / .15), clamp((end - t) / .15));
    const size = 62, maxW = 900, lineH = 92;
    ctx.save();
    ctx.font = `900 ${size}px Cairo`; ctx.direction = 'rtl';
    const sp = ctx.measureText(' ').width + 16;
    // wrap
    const lines = [[]]; let lw = 0;
    for (const o of ws) {
      o.m = ctx.measureText(o.w).width;
      if (lw + o.m > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
      lines[lines.length - 1].push(o); lw += o.m + sp;
    }
    const cy = 1475 - (lines.length - 1) * lineH / 2 + (1 - E.out(clamp((t - start) / .25))) * 30;
    // backing band
    const bandH = lines.length * lineH + 60;
    const bg = ctx.createLinearGradient(0, cy - bandH / 2 - 40, 0, cy + bandH);
    ctx.globalAlpha = a;
    rrect(70, cy - lineH / 2 - 30, 940, bandH - 8, 34);
    ctx.fillStyle = 'rgba(8,6,10,0.55)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(239,89,36,0.35)'; ctx.stroke();
    lines.forEach((ln, li) => {
      const tw = ln.reduce((s, o) => s + o.m, 0) + sp * (ln.length - 1);
      let x = 540 + tw / 2; // RTL: start from right
      const y = cy + li * lineH;
      for (const o of ln) {
        const cx = x - o.m / 2;
        const active = t >= o.a && t < o.b + .05;
        const past = t >= o.b + .05;
        const pa = prog(t, o.a, o.a + .18);
        const sc = active ? 1 + .07 * Math.sin(Math.PI * clamp((t - o.a) / Math.max(.2, o.b - o.a))) : 1;
        ctx.save();
        ctx.translate(cx, y - (active ? 6 * E.out(pa) : 0)); ctx.scale(sc, sc);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.strokeText(o.w, 0, 0);
        if (active) { ctx.shadowColor = C.o; ctx.shadowBlur = 28; ctx.fillStyle = C.o2; }
        else ctx.fillStyle = past ? '#FFFFFF' : 'rgba(255,255,255,0.38)';
        ctx.fillText(o.w, 0, 0);
        ctx.restore();
        x -= o.m + sp;
      }
    });
    ctx.restore();
  }
}
