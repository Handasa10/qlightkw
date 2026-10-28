// Render views of a 3D room in headless Chromium (three.js on SwiftShader).
// Usage: node studio/3d/shoot.js <body> "<view>@<state>;<view>@<state>" <width> <height> <outdir>
//   <body>  file name in studio/3d/bodies without .html (each body defines VIEWS and window.setState)
// Writes <outdir>/<view>_<state>.jpg (characters : | + become -). Run `npm install` in studio/3d once.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const [,, body, jobs, w, h, out] = process.argv;
const dir = __dirname;
const page = `_page_${body}.html`;
fs.writeFileSync(path.join(dir, page), ['head.html', `bodies/${body}.html`, 'tail.html'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n'));
fs.mkdirSync(out, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1', async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
  await p.addInitScript(`window.RW=${w};window.RH=${h};`);
  await p.goto(`http://127.0.0.1:${server.address().port}/${page}`);
  await p.waitForFunction('window.READY === true', null, { timeout: 180000 });
  for (const j of jobs.split(';')) {
    const [v, st] = j.split('@'); await p.evaluate(s => window.setState(s), st);
    const d = await p.evaluate(n => window.render(n), v);
    fs.writeFileSync(path.join(out, `${v}_${st.replace(/[:|+]/g, '-')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); console.log(v, st);
  }
  await b.close(); server.close(); fs.unlinkSync(path.join(dir, page));
});
