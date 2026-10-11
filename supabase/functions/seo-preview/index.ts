// Link previews for apps that don't run JavaScript (WhatsApp, Instagram, Facebook, Snapchat,
// X, Telegram...). nginx sends those crawlers here; this returns a small HTML page with the
// real title, description, image and price of the shared page.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";
import { escapeHtml } from "../_shared/auth.ts";

const SITE = "https://qlightkw.com";
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

interface Preview {
  title: string;
  description: string;
  image: string;
  type: "website" | "product" | "article";
  price?: number;
}

const DEFAULTS = {
  en: {
    title: "Quality Light Kuwait | Lighting, LED & Chandeliers Store",
    description: "LED lights, chandeliers, spotlights and smart lighting with fast delivery across Kuwait. Showroom on Tunis Street, Hawalli. WhatsApp +965 5111 1725.",
  },
  ar: {
    title: "كواليتي لايت الكويت | محل إضاءة وثريات وإنارة LED",
    description: "إنارة LED وثريات وسبوت لايت وإضاءة ذكية مع توصيل سريع لجميع مناطق الكويت. معرضنا في حولي – شارع تونس. واتساب 51111725.",
  },
};

const absolute = (src: string | null | undefined) =>
  !src ? DEFAULT_IMAGE : /^https?:\/\//.test(src) ? src : new URL(src, SITE).toString();

async function buildPreview(path: string, params: URLSearchParams, lang: "en" | "ar"): Promise<Preview> {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ar = lang === "ar";
  const base: Preview = { ...DEFAULTS[lang], image: DEFAULT_IMAGE, type: "website" };

  const product = path.match(/^\/product\/([^/]+)/);
  if (product) {
    const { data: p } = await supabase
      .from("products")
      .select("id, name_en, name_ar, short_description_en, short_description_ar, description_en, description_ar, base_price, sale_price")
      .eq("slug", decodeURIComponent(product[1]))
      .eq("is_active", true)
      .maybeSingle();
    if (!p) return base;
    const { data: img } = await supabase
      .from("product_images").select("url").eq("product_id", p.id)
      .order("is_primary", { ascending: false }).order("sort_order").limit(1).maybeSingle();
    const name = (ar ? p.name_ar : p.name_en) || p.name_en;
    const price = Number(p.sale_price || p.base_price) || 0;
    const desc = (ar ? p.short_description_ar || p.description_ar : p.short_description_en || p.description_en) || "";
    return {
      title: ar ? `${name} | ${price.toFixed(3)} د.ك | كواليتي لايت` : `${name} | ${price.toFixed(3)} KWD | Quality Light Kuwait`,
      description: desc || (ar ? `${name} بسعر ${price.toFixed(3)} د.ك مع توصيل سريع في الكويت.` : `${name} for ${price.toFixed(3)} KWD with fast delivery in Kuwait.`),
      image: absolute(img?.url),
      type: "product",
      price,
    };
  }

  const project = path.match(/^\/project\/([^/]+)/);
  if (project) {
    const { data: p } = await supabase
      .from("projects").select("title_en, title_ar, description_en, description_ar, location")
      .eq("slug", decodeURIComponent(project[1])).maybeSingle();
    if (!p) return base;
    const title = (ar ? p.title_ar : p.title_en) || p.title_en;
    return { ...base, title: `${title} | ${ar ? "مشاريع كواليتي لايت" : "Quality Light Projects"}`, description: (ar ? p.description_ar : p.description_en) || base.description };
  }

  const post = path.match(/^\/blog\/([^/]+)/);
  if (post) {
    const { data: b } = await supabase
      .from("blog_posts").select("title_en, title_ar, excerpt_en, excerpt_ar, featured_image_url")
      .eq("slug", decodeURIComponent(post[1])).eq("is_published", true).maybeSingle();
    if (!b) return base;
    return {
      title: (ar ? b.title_ar : b.title_en) || b.title_en,
      description: (ar ? b.excerpt_ar : b.excerpt_en) || base.description,
      image: absolute(b.featured_image_url),
      type: "article",
    };
  }

  const category = params.get("category");
  if (path.startsWith("/shop") && category) {
    const { data: c } = await supabase
      .from("categories").select("name_en, name_ar, image_url").eq("slug", category).maybeSingle();
    if (c) {
      const name = (ar ? c.name_ar : c.name_en) || c.name_en;
      return {
        ...base,
        title: ar ? `${name} في الكويت | كواليتي لايت` : `${name} in Kuwait | Quality Light`,
        description: ar ? `تسوق ${name} مع توصيل سريع لجميع مناطق الكويت.` : `Shop ${name} with fast delivery across Kuwait.`,
        image: absolute(c.image_url),
      };
    }
  }

  return base;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/";
  const lang = url.searchParams.get("lang") === "ar" ? "ar" : "en";

  let preview: Preview;
  try {
    preview = await buildPreview(path, url.searchParams, lang);
  } catch (error) {
    console.error("seo-preview error:", error);
    preview = { ...DEFAULTS[lang], image: DEFAULT_IMAGE, type: "website" };
  }

  const pageUrl = new URL(path, SITE);
  for (const key of ["category", "lang"]) {
    const v = url.searchParams.get(key);
    if (v) pageUrl.searchParams.set(key, v);
  }
  const e = escapeHtml;
  const html = `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<title>${e(preview.title)}</title>
<meta name="description" content="${e(preview.description.slice(0, 200))}">
<link rel="canonical" href="${e(pageUrl.toString())}">
<meta property="og:site_name" content="${lang === "ar" ? "كواليتي لايت الكويت" : "Quality Light Kuwait"}">
<meta property="og:locale" content="${lang === "ar" ? "ar_KW" : "en_KW"}">
<meta property="og:type" content="${preview.type}">
<meta property="og:title" content="${e(preview.title)}">
<meta property="og:description" content="${e(preview.description.slice(0, 200))}">
<meta property="og:url" content="${e(pageUrl.toString())}">
<meta property="og:image" content="${e(preview.image)}">
${preview.price !== undefined ? `<meta property="product:price:amount" content="${preview.price.toFixed(3)}">\n<meta property="product:price:currency" content="KWD">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(preview.title)}">
<meta name="twitter:description" content="${e(preview.description.slice(0, 200))}">
<meta name="twitter:image" content="${e(preview.image)}">
</head>
<body>
<h1>${e(preview.title)}</h1>
<p>${e(preview.description)}</p>
<img src="${e(preview.image)}" alt="${e(preview.title)}">
<p><a href="${e(pageUrl.toString())}">${e(pageUrl.toString())}</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=600" },
  });
});
