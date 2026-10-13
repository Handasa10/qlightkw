// Crops a showroom photo to the product and gently lifts the levels (pure JS, runs in the edge runtime)
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

export async function cropAndEnhance(bytes: Uint8Array, box?: number[]): Promise<Uint8Array> {
  try {
    const decoded = await decode(bytes);
    if (!(decoded instanceof Image)) return bytes;
    let img = decoded;
    const W = img.width, H = img.height;

    // Square crop around the product (Gemini box is [ymin, xmin, ymax, xmax] on a 0-1000 scale)
    if (box && box.length === 4 && box.every((v) => Number.isFinite(v))) {
      const [y0, x0, y1, x1] = box.map((v) => Math.max(0, Math.min(1000, v)) / 1000);
      const bw = (x1 - x0) * W, bh = (y1 - y0) * H;
      if (bw > W * 0.08 && bh > H * 0.08) {
        const side = Math.min(Math.max(bw, bh) * 1.22, W, H);
        const cx = ((x0 + x1) / 2) * W, cy = ((y0 + y1) / 2) * H;
        const left = Math.round(Math.max(0, Math.min(W - side, cx - side / 2)));
        const top = Math.round(Math.max(0, Math.min(H - side, cy - side / 2)));
        img = img.crop(left, top, Math.round(side), Math.round(side));
      }
    }
    if (Math.max(img.width, img.height) > 1200) {
      img = img.width >= img.height ? img.resize(1200, Image.RESIZE_AUTO) : img.resize(Image.RESIZE_AUTO, 1200);
    }

    // Auto levels: stretch the 1st-99th percentile of brightness to the full range (gently)
    const px = img.bitmap;
    const hist = new Uint32Array(256);
    for (let i = 0; i < px.length; i += 4) hist[(px[i] * 77 + px[i + 1] * 150 + px[i + 2] * 29) >> 8]++;
    const total = px.length / 4;
    let lo = 0, hi = 255, acc = 0;
    for (; lo < 255; lo++) { acc += hist[lo]; if (acc > total * 0.01) break; }
    acc = 0;
    for (; hi > 0; hi--) { acc += hist[hi]; if (acc > total * 0.01) break; }
    lo = Math.min(lo, 40); hi = Math.max(hi, 200);
    if (hi - lo > 40 && (lo > 4 || hi < 251)) {
      const scale = 255 / (hi - lo);
      const lut = new Uint8ClampedArray(256);
      for (let v = 0; v < 256; v++) lut[v] = (v - lo) * scale * 0.85 + v * 0.15;
      for (let i = 0; i < px.length; i += 4) { px[i] = lut[px[i]]; px[i + 1] = lut[px[i + 1]]; px[i + 2] = lut[px[i + 2]]; }
    }
    return await img.encodeJPEG(86);
  } catch (e) {
    console.error("image processing failed, using the original", e);
    return bytes;
  }
}
