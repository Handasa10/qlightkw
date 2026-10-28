// ---------- villa design helpers ----------
const IM = {};
function imgCard(img, x, y, w, h, o = {}) {
  if (!img || (o.a ?? 1) <= 0) return;
  const sx = o.sx ?? 0, sy = o.sy ?? 0, sw = o.sw ?? img.width, sh = o.sh ?? img.height;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (o.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.fillStyle = '#000'; rrect(x, y, w, h, o.r ?? 26); ctx.fill(); ctx.shadowBlur = 0; }
  ctx.beginPath(); rrect(x, y, w, h, o.r ?? 26); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
  if (o.stroke) { ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.stroke; ctx.lineWidth = 5; rrect(x, y, w, h, o.r ?? 26); ctx.stroke(); ctx.restore(); }
}
// zoom window into plan image (crop coords in image px)
function planView(img, cx, cy, zw, x, y, w, h, a = 1, stroke) { const zh = zw * h / w; imgCard(img, x, y, w, h, { sx: cx - zw / 2, sy: cy - zh / 2, sw: zw, sh: zh, a, stroke }); }
function stepHead(t, n, title, t0) {
  const p = E.back(prog(t, t0, t0 + .45)); if (p <= 0) return;
  txt('الخطوة', 540, 120, { size: 40, weight: 800, color: C.warm, alpha: Math.min(1, p) });
  ctx.save(); ctx.translate(540, 220); ctx.scale(p, p); ctx.fillStyle = C.o; ctx.shadowColor = C.o; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fill(); ctx.shadowBlur = 0; txt(String(n), 0, 5, { size: 72, weight: 900, color: '#fff', dir: 'ltr' }); ctx.restore();
  pop(title, 540, 360, t, t0 + .15, 0, { size: 80, weight: 900, color: C.w, glow: 25 });
  // progress dots
  for (let i = 1; i <= 5; i++) { ctx.save(); ctx.globalAlpha *= Math.min(1, p); ctx.fillStyle = i <= n ? C.o : 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(540 + (3 - i) * 44, 1840, 12, 0, 7); ctx.fill(); ctx.restore(); }
}
function pulseBox(x, y, w, h, t, t0, col = C.o) { const p = E.out(prog(t, t0, t0 + .4)); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p * (.7 + .3 * Math.sin(t * 6)); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.shadowColor = col; ctx.shadowBlur = 20; rrect(x, y, w, h, 14); ctx.stroke(); ctx.restore(); }
// plan crop is 2350 x 1330; shown full at x 40..1040 (w 1000, h 566)
const PW = 1000, PH = 566, PXO = 40, PYO = 640, PS = PW / 2350;
const P2S = (u, v) => [PXO + u * PS, PYO + v * PS];

