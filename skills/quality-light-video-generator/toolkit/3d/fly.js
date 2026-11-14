// Animated 3D: render a body that defines window.frameShot(t) (camera + state for global time t, e.g. bodies/buyways.html).
//   node studio/3d/fly.js <body> stills "t1,t2,..." <W> <H> <outdir>        -> <outdir>/f_<t>.jpg
//   node studio/3d/fly.js <body> video <t0> <t1> <W> <H> <out.mp4> [fps=30]  -> H.264 clip of [t0, t1)
// Run several `video` chunks in parallel and concat them (ffmpeg concat demuxer) for a long fly-through.
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const fs = require('fs'), path = require('path'), http = require('http'), { spawn } = require('child_process');
const [,, body, mode, ...a] = process.argv;
const dir = __dirname;
const page = `_page_${body}_${process.pid}.html`;
fs.writeFileSync(path.join(dir, page), ['head.html', `bodies/${body}.html`, 'tail.html'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n'));
const [W, H] = mode === 'stills' ? [+a[1], +a[2]] : [+a[2], +a[3]];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1', async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  p.on('pageerror', e => { console.log('PAGEERR', e.message); process.exit(1); });
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
  await p.addInitScript(`window.RW=${W};window.RH=${H};`);
  await p.goto(`http://127.0.0.1:${server.address().port}/${page}`);
  await p.waitForFunction('window.READY === true', null, { timeout: 180000 });
  const grab = async t => Buffer.from((await p.evaluate(t => window.frameShot(t), t)).split(',')[1], 'base64');
  if (mode === 'stills') {
    fs.mkdirSync(a[3], { recursive: true });
    for (const t of a[0].split(',').map(Number)) { fs.writeFileSync(path.join(a[3], `f_${t.toFixed(2)}.jpg`), await grab(t)); console.log('still', t); }
  } else {
    const [t0, t1] = [+a[0], +a[1]], out = a[4], fps = +(a[5] || 30);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n0 = Math.round(t0 * fps), n1 = Math.round(t1 * fps), st = Date.now();
    for (let n = n0; n < n1; n++) {
      const buf = await grab(n / fps);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((n - n0) % 30 === 0) console.log('frame', n, '/', n1, ((Date.now() - st) / 1000).toFixed(0) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); server.close(); fs.unlinkSync(path.join(dir, page));
});
