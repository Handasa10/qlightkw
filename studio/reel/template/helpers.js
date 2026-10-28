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
// Start / end of every frame. In overlay mode (graphics over AI or phone footage) the canvas stays transparent.
function beginFrame() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (window.OVERLAY) ctx.clearRect(0, 0, W, H); else { ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H); }
}
function endFrame(t) { if (!window.OVERLAY) finish(t); }
