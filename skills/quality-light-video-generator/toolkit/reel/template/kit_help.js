function spotTop(x, y, on, s = 1, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(x, y, 120 * s, '#FFD6A0', .45 * on); ctx.restore(); }
  ctx.fillStyle = '#1b1a1d'; ctx.beginPath(); ctx.arc(x, y, 20 * s, 0, 7); ctx.fill();
  ctx.fillStyle = on > 0 ? `rgba(255,240,215,${.35 + .65 * on})` : '#444'; ctx.beginPath(); ctx.arc(x, y, 12 * s, 0, 7); ctx.fill();
  ctx.restore();
}
function dimH(x0, x1, y, txtS, a, col = C.amber) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  [[x0, 1], [x1, -1]].forEach(([x, s]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s * 18, y - 11); ctx.lineTo(x + s * 18, y + 11); ctx.fill(); });
  ctx.restore();
  txt(txtS, (x0 + x1) / 2, y - 40, { size: 46, weight: 900, color: col, dir: 'ltr', alpha: a });
}
function dimV(x, y0, y1, txtS, a, col = C.amber) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  [[y0, 1], [y1, -1]].forEach(([y, s]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 11, y + s * 18); ctx.lineTo(x + 11, y + s * 18); ctx.fill(); });
  ctx.restore();
  txt(txtS, x + 50, (y0 + y1) / 2, { size: 46, weight: 900, color: col, dir: 'ltr', rot: -Math.PI / 2, alpha: a });
}
const SP13 = [[.5, .8], [1.5, .8], [2.5, .8], [3.5, .8], [4.5, .8], [1, 2], [2.5, 2], [4, 2], [.5, 3.2], [1.5, 3.2], [2.5, 3.2], [3.5, 3.2], [4.5, 3.2]];
const SP8 = [[.85, 1], [1.95, 1], [3.05, 1], [4.15, 1], [.85, 3], [1.95, 3], [3.05, 3], [4.15, 3]];
function counter(t, t0, n, y, text, col = C.o2) {
  const p = prog(t, t0, t0 + .8); if (p <= 0) return;
  const v = Math.round(lerp(0, n, E.out(p)));
  pop(`≈ ${v}`, 540, y, t, t0, 0, { size: 120, weight: 900, color: col, glow: 30, dir: 'ltr' });
  txt(text, 540, y + 100, { size: 48, weight: 800, color: C.w, alpha: prog(t, t0 + .2, t0 + .6) });
}
function bubble(x, y, w, h, a, col = '#2b2730') { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; rrect(x, y, w, h, 34); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + w - 60, y + h); ctx.lineTo(x + w - 20, y + h + 34); ctx.lineTo(x + w - 100, y + h); ctx.fill(); ctx.restore(); }
function plane(x, y, s, a) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-60, -10); ctx.lineTo(60, -50); ctx.lineTo(20, 60); ctx.lineTo(0, 10); ctx.closePath(); ctx.moveTo(0, 10); ctx.lineTo(60, -50); ctx.stroke(); ctx.restore(); }

// ---------- scenes ----------
