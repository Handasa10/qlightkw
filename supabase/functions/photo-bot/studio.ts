// Turns a showroom snapshot into a studio-style product photo with Gemini's image model
// (Google directly, then the same model through OpenRouter). The product itself must stay
// exactly as photographed; only background, lighting and framing change.
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const GOOGLE_MODELS = ["gemini-2.5-flash-image"];
const OPENROUTER_MODEL = "google/gemini-2.5-flash-image";

const PROMPT = (hint: string) => `Edit this photo into a professional e-commerce product photo for a lighting and electrical shop.
${hint ? `The product is: ${hint}.\n` : ""}Rules:
- Keep the product EXACTLY as it is: same shape, proportions, colours, materials, finish, number of parts, cables and any printed text or markings. Do not redesign, restyle or "improve" the product itself.
- Remove the background, people, hands, price tags, ceiling clutter and other products.
- Place the product, centred, on a clean seamless studio background (soft white to very light grey), with a natural soft shadow under or behind it.
- Even, soft professional studio lighting, crisp focus, realistic colours, no colour cast. If the light fitting is switched on in the photo, keep a natural warm glow.
- Square 1:1 framing with comfortable margins.
- Do not add text, logos, watermarks, props or extra products.`;

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};
const fromBase64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function viaGoogle(image: Uint8Array, mime: string, prompt: string): Promise<Uint8Array> {
  const key = Deno.env.get("GOOGLE_AI_API_KEY");
  if (!key) throw new Error("no Google key");
  let last = "";
  for (const model of GOOGLE_MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ inlineData: { mimeType: mime, data: toBase64(image) } }, { text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      try { last = `Google ${res.status}: ${JSON.parse(detail)?.error?.message?.slice(0, 100) || ""}`; } catch { last = `Google ${res.status}`; }
      continue;
    }
    const out = await res.json();
    const part = out.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { mimeType?: string } }) => p.inlineData?.mimeType?.startsWith("image/"));
    if (part?.inlineData?.data) return fromBase64(part.inlineData.data);
    last = "Google returned no image";
  }
  throw new Error(last);
}

async function viaOpenRouter(image: Uint8Array, mime: string, prompt: string): Promise<Uint8Array> {
  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) throw new Error("no OpenRouter key");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "https://qlightkw.com", "X-Title": "Quality Light Kuwait" },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${mime};base64,${toBase64(image)}` } },
      ] }],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 100)}`);
  const out = await res.json();
  const url: string | undefined = out.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  const b64 = url?.split(",")[1];
  if (!b64) throw new Error("OpenRouter returned no image");
  return fromBase64(b64);
}

// Square, at most 1200px, JPEG
async function finish(bytes: Uint8Array): Promise<Uint8Array> {
  const decoded = await decode(bytes);
  if (!(decoded instanceof Image)) return bytes;
  let img = decoded;
  const side = Math.min(img.width, img.height);
  if (img.width !== img.height) img = img.crop(Math.round((img.width - side) / 2), Math.round((img.height - side) / 2), side, side);
  if (side > 1200) img = img.resize(1200, 1200);
  return await img.encodeJPEG(88);
}

export async function studioShot(image: Uint8Array, mime: string, hint = ""): Promise<Uint8Array> {
  const prompt = PROMPT(hint.slice(0, 120));
  const errors: string[] = [];
  for (const attempt of [viaGoogle, viaOpenRouter]) {
    try {
      return await finish(await attempt(image, mime, prompt));
    } catch (e) {
      errors.push((e as Error).message);
    }
  }
  throw new Error(errors.join(" · "));
}
