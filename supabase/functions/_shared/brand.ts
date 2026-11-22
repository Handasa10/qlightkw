// Stamps the QL logo in the bottom corner of a product photo
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import { QL_LOGO_PNG_BASE64 } from "./ql-logo.ts";

let logo: Image | null = null;
async function getLogo(): Promise<Image> {
  if (!logo) logo = (await decode(Uint8Array.from(atob(QL_LOGO_PNG_BASE64), (c) => c.charCodeAt(0)))) as Image;
  return logo;
}

// Logo about 16% of the photo width, inset 3.5% from the bottom-right corner
export async function stampLogo(img: Image): Promise<Image> {
  const base = await getLogo();
  const width = Math.max(48, Math.round(img.width * 0.16));
  const mark = base.clone().resize(width, Image.RESIZE_AUTO).opacity(0.92);
  const margin = Math.round(img.width * 0.035);
  return img.composite(mark, img.width - mark.width - margin, img.height - mark.height - margin);
}

// Square (centre crop), at most `max` px, logo stamped, JPEG
export async function brandedSquare(bytes: Uint8Array, max = 1200): Promise<Uint8Array> {
  const decoded = await decode(bytes);
  if (!(decoded instanceof Image)) return bytes;
  let img = decoded;
  const side = Math.min(img.width, img.height);
  if (img.width !== img.height) img = img.crop(Math.round((img.width - side) / 2), Math.round((img.height - side) / 2), side, side);
  if (side > max) img = img.resize(max, max);
  img = await stampLogo(img);
  return await img.encodeJPEG(88);
}

// Logo stamped without cropping (for the owner's own photo when the AI studio is unavailable)
export async function brandedAsIs(bytes: Uint8Array, max = 1200): Promise<Uint8Array> {
  try {
    const decoded = await decode(bytes);
    if (!(decoded instanceof Image)) return bytes;
    let img = decoded;
    if (Math.max(img.width, img.height) > max) img = img.width >= img.height ? img.resize(max, Image.RESIZE_AUTO) : img.resize(Image.RESIZE_AUTO, max);
    img = await stampLogo(img);
    return await img.encodeJPEG(88);
  } catch (e) {
    console.error("logo stamp failed", e);
    return bytes;
  }
}
