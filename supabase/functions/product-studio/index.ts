// Works through the studio_images queue: generates an original studio-style product image for
// each pending "look" with Gemini's image model, stores it in product-images/studio/, and puts it
// on every product mapped to that look whose current photo is only a stock photo.
//
// Started by public.run_studio_queue() (pg_net), which presents the secret from studio_settings.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";
import { decode, Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const BUCKET = "product-images";
const GOOGLE_MODELS = ["gemini-2.5-flash-image", "gemini-3-pro-image-preview"];
const OPENROUTER_MODEL = "google/gemini-2.5-flash-image";
const STOCK = "https://images.unsplash.com/";

const STYLE = `Professional e-commerce product photograph. One single product, centred, photographed in a studio on a seamless pure white background with a soft natural shadow beneath it. Even softbox lighting, sharp focus, true-to-life colours, photorealistic, high detail. Square 1:1 composition with comfortable margins. No text, no logos, no brand names, no watermark, no packaging, no hands, no people, no props, no extra objects.`;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const fromBase64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function viaGoogle(prompt: string): Promise<Uint8Array> {
  const key = Deno.env.get("GOOGLE_AI_API_KEY");
  if (!key) throw new Error("no Google key");
  const errors: string[] = [];
  for (const model of GOOGLE_MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["TEXT", "IMAGE"] } }),
    });
    if (!res.ok) {
      const detail = await res.text();
      let reason = "";
      try { reason = JSON.parse(detail)?.error?.message?.slice(0, 120) || ""; } catch { /* not JSON */ }
      errors.push(`${model} ${res.status} ${reason}`);
      continue;
    }
    const out = await res.json();
    const part = out.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { mimeType?: string } }) => p.inlineData?.mimeType?.startsWith("image/"));
    if (part?.inlineData?.data) return fromBase64(part.inlineData.data);
    errors.push(`${model} returned no image`);
  }
  throw new Error(errors.join(" | "));
}

async function viaOpenRouter(prompt: string): Promise<Uint8Array> {
  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) throw new Error("no OpenRouter key");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "https://qlightkw.com", "X-Title": "Quality Light Kuwait" },
    body: JSON.stringify({ model: OPENROUTER_MODEL, modalities: ["image", "text"], messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status} ${(await res.text()).slice(0, 120)}`);
  const out = await res.json();
  const b64 = (out.choices?.[0]?.message?.images?.[0]?.image_url?.url as string | undefined)?.split(",")[1];
  if (!b64) throw new Error("OpenRouter returned no image");
  return fromBase64(b64);
}

// Square, 1000px, JPEG
async function finish(bytes: Uint8Array): Promise<Uint8Array> {
  const decoded = await decode(bytes);
  if (!(decoded instanceof Image)) return bytes;
  let img = decoded;
  const side = Math.min(img.width, img.height);
  if (img.width !== img.height) img = img.crop(Math.round((img.width - side) / 2), Math.round((img.height - side) / 2), side, side);
  if (side > 1000) img = img.resize(1000, 1000);
  return await img.encodeJPEG(86);
}

async function generate(prompt: string): Promise<Uint8Array> {
  const full = `${STYLE}\n\nThe product: ${prompt}`;
  const errors: string[] = [];
  for (const attempt of [viaGoogle, viaOpenRouter]) {
    try { return await finish(await attempt(full)); } catch (e) { errors.push((e as Error).message); }
  }
  throw new Error(errors.join(" · ").slice(0, 500));
}

// Put a finished image on its products, replacing stock photos (or an older studio image) only
async function apply(key: string, url: string) {
  const { data: links } = await db.from("studio_image_products").select("product_id").eq("key", key);
  let changed = 0;
  for (const { product_id } of links || []) {
    const { data: images } = await db.from("product_images").select("id, url, is_primary").eq("product_id", product_id);
    const primary = (images || []).find((i) => i.is_primary) || (images || [])[0];
    if (!primary) {
      await db.from("product_images").insert({ product_id, url, is_primary: true, sort_order: 0 });
      changed++;
    } else if (primary.url.startsWith(STOCK) || primary.url.includes(`/${BUCKET}/studio/`)) {
      await db.from("product_images").update({ url }).eq("id", primary.id);
      changed++;
    }
  }
  return changed;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const { data: settings } = await db.from("studio_settings").select("token, batch").maybeSingle();
  if (!settings || req.headers.get("x-studio-token") !== settings.token) return json({ error: "Forbidden" }, 403);

  // Rows left "working" by a run that died are retried
  await db.from("studio_images").update({ status: "pending" }).eq("status", "working").lt("updated_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

  const { data: queue } = await db.from("studio_images").select("key, prompt, attempts")
    .eq("status", "pending").lt("attempts", 3).order("created_at").limit(Math.max(1, Math.min(6, settings.batch)));
  const results: Record<string, string> = {};

  await Promise.all((queue || []).map(async (row) => {
    const now = () => new Date().toISOString();
    await db.from("studio_images").update({ status: "working", attempts: row.attempts + 1, updated_at: now() }).eq("key", row.key);
    try {
      const bytes = await generate(row.prompt);
      const path = `studio/${row.key}.jpg`;
      const up = await db.storage.from(BUCKET).upload(path, bytes, { contentType: "image/jpeg", upsert: true });
      if (up.error) throw up.error;
      const url = `${db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}?v=${row.attempts + 1}`;
      await db.from("studio_images").update({ status: "done", url, error: null, updated_at: now() }).eq("key", row.key);
      results[row.key] = `done, ${await apply(row.key, url)} products`;
    } catch (e) {
      const message = (e as Error).message;
      await db.from("studio_images").update({ status: row.attempts + 1 >= 3 ? "failed" : "pending", error: message, updated_at: now() }).eq("key", row.key);
      results[row.key] = `error: ${message}`;
    }
  }));

  console.log("product-studio", results);
  return json({ processed: Object.keys(results).length, results });
});
