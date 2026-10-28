const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
const path = require('path');
const [,, mode, a, b] = process.argv; // mode: stills "t1,t2,..." | video out.mp4 [start end]
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('PAGE', m.text()));
  page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction('window.READY === true');
  const grab = async t => Buffer.from((await page.evaluate(t => { draw(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t)).split(',')[1], 'base64');
  if (mode === 'stills') {
    const fs = require('fs');
    for (const t of a.split(',').map(Number)) fs.writeFileSync(path.join(__dirname, 'stills', `s_${t.toFixed(2)}.jpg`), await grab(t));
  } else {
    const fps = 30, s = Number(b || 0), e = Number(process.argv[5] || 58.9);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', a], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n0 = Math.round(s * fps), n1 = Math.round(e * fps);
    const t0 = Date.now();
    for (let n = n0; n < n1; n++) {
      const buf = await grab(n / fps);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (n % 150 === 0) console.log('frame', n, ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
