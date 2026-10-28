// Screenshot a 1080x1350 post page.  Usage: node studio/post/shot.js <page.html> <out.jpg>
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const path = require('path');
(async () => {
  const [,, html, out] = process.argv;
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.resolve(html));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await b.close();
})();
