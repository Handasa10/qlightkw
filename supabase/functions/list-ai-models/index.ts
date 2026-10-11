// Lists the Google AI models available to the configured API key, so the admin AI settings
// always show current Gemini versions instead of a hardcoded list. Admin only.

import { requireAdmin, errorStatus } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GoogleModel {
  name: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
}

export interface ListedModel {
  value: string;
  label: string;
  description: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    await requireAdmin(req);

    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) throw new Error("GOOGLE_AI_API_KEY is not configured");

    // The API pages its results; collect them all
    const models: GoogleModel[] = [];
    let pageToken = "";
    for (let page = 0; page < 10; page++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        let reason = "";
        try { reason = (await res.json())?.error?.message || ""; } catch { /* not JSON */ }
        throw new Error(`Google API error: ${res.status}${reason ? ` - ${reason}` : ""}`);
      }
      const data = await res.json();
      models.push(...(data.models || []));
      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }

    const toListed = (m: GoogleModel): ListedModel => ({
      value: m.name.replace(/^models\//, ""),
      label: m.displayName || m.name.replace(/^models\//, ""),
      description: (m.description || "").slice(0, 120),
    });

    const isImage = (m: GoogleModel) =>
      /image|imagen/i.test(m.name) && !/embedding/i.test(m.name);
    const canGenerate = (m: GoogleModel) =>
      (m.supportedGenerationMethods || []).some((g) => g === "generateContent" || g === "predict");

    // Newest first: model names carry their version number
    const byVersionDesc = (a: ListedModel, b: ListedModel) =>
      b.value.localeCompare(a.value, undefined, { numeric: true });

    const text = models
      .filter((m) => /gemini/i.test(m.name) && !isImage(m) && (m.supportedGenerationMethods || []).includes("generateContent"))
      .filter((m) => !/embedding|aqa|tts|audio|live|robotics|computer-use/i.test(m.name))
      .map(toListed)
      .sort(byVersionDesc);

    const image = models.filter((m) => isImage(m) && canGenerate(m)).map(toListed).sort(byVersionDesc);

    return new Response(JSON.stringify({ success: true, text, image }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("list-ai-models error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: errorStatus(error),
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
