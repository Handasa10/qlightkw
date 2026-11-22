// Admin photo upload: turns a product photo into a professional studio shot (the product itself
// unchanged) with the QL logo stamped in the corner, stores it and returns its public URL.
// If the AI studio is unavailable the admin's own photo is kept, with the logo.
import { requireAdmin, errorStatus } from "../_shared/auth.ts";
import { studioShot } from "../_shared/studio.ts";
import { brandedAsIs } from "../_shared/brand.ts";

const BUCKET = "product-images";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { admin } = await requireAdmin(req);
    const body = await req.json();
    const data = String(body.data || "");
    const mime = /^image\/(png|jpeg|webp)$/.test(body.mimeType) ? body.mimeType : "image/jpeg";
    const hint = String(body.hint || "").slice(0, 120);
    const studio = body.studio !== false;
    const folder = /^[a-z-]{1,20}$/.test(body.folder || "") ? body.folder : "products";
    if (!data || data.length > 14_000_000) return json({ error: "Missing or too large image" }, 400);
    const original = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

    let bytes: Uint8Array | null = null;
    let studioError: string | null = null;
    if (studio) {
      try { bytes = await studioShot(original, mime, hint); } catch (e) { studioError = (e as Error).message; }
    }
    const usedStudio = !!bytes;
    if (!bytes) bytes = await brandedAsIs(original);

    const path = `${folder}/ql-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
    const up = await admin.storage.from(BUCKET).upload(path, bytes, { contentType: "image/jpeg", upsert: false });
    if (up.error) throw up.error;
    const url = admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    return json({ url, studio: usedStudio, studio_error: studioError });
  } catch (e) {
    console.error("photo-enhance", e);
    return json({ error: (e as Error).message }, errorStatus(e));
  }
});
