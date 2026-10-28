// Render the reel canvas (index.html + scenes.js) with headless Chromium.
//   node render.js stills "t1,t2,..."                         -> stills/s_<t>.jpg
//   node render.js video <out.mp4> <start> <end>               -> frames of the motion-graphics reel
//   node render.js overlay <base.mp4> <out.mp4> <start> <end>  -> graphics drawn over a footage edit (window.OVERLAY = true,
//                                                               the canvas stays transparent where nothing is drawn)
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const [,, mode, a, b, c, d] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('PAGE', m.text()));
  page.on('pageerror', e => console.log('ERR', e.message));
  if (mode === 'overlay') await page.addInitScript('window.OVERLAY = true;');
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  await page.waitForFunction('window.READY === true');
  const fmt = mode === 'overlay' ? 'image/png' : 'image/jpeg';
  const grab = async t => Buffer.from((await page.evaluate(([t, f]) => { draw(t); return document.getElementById('c').toDataURL(f, 0.93); }, [t, fmt])).split(',')[1], 'base64');
  if (mode === 'stills') {
    fs.mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
    for (const t of a.split(',').map(Number)) fs.writeFileSync(path.join(__dirname, 'stills', `s_${t.toFixed(2)}.jpg`), await grab(t));
  } else {
    const fps = 30;
    const [out, s, e] = mode === 'overlay' ? [b, Number(c || 0), Number(d)] : [a, Number(b || 0), Number(c)];
    const args = mode === 'overlay'
      ? ['-y', '-loglevel', 'error', '-ss', String(s), '-t', String(e - s), '-i', a, '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
        '-filter_complex', '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setpts=PTS-STARTPTS[b];[b][1:v]overlay=format=auto:shortest=1',
        '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out]
      : ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out];
    const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
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
