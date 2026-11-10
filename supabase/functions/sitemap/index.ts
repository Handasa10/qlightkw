// XML sitemap built live from the catalog, served at https://qlightkw.com/sitemap.xml
// (nginx proxies that path here). Every URL is listed with its English and Arabic versions.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";

const SITE = "https://qlightkw.com";

const STATIC_PAGES: Array<[string, string, number]> = [
  ["/", "daily", 1.0],
  ["/shop", "daily", 0.9],
  ["/projects", "weekly", 0.7],
  ["/blog", "weekly", 0.6],
  ["/about", "monthly", 0.5],
  ["/contact", "monthly", 0.6],
  ["/faq", "monthly", 0.5],
  ["/shipping", "yearly", 0.3],
  ["/returns", "yearly", 0.3],
  ["/privacy", "yearly", 0.2],
  ["/terms", "yearly", 0.2],
];

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function withLang(path: string, lang: "en" | "ar") {
  const url = new URL(path, SITE);
  if (lang === "ar") url.searchParams.set("lang", "ar");
  return url.toString();
}

// One <url> per language, each pointing at both alternates (Google's hreflang sitemap format)
function entry(path: string, lastmod: string | null, changefreq: string, priority: number) {
  const en = xmlEscape(withLang(path, "en"));
  const ar = xmlEscape(withLang(path, "ar"));
  const alternates = `<xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="ar" href="${ar}"/><xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`;
  const meta = `${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}<changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority>`;
  // Sitemap schema order: loc, lastmod, changefreq, priority, then extension elements
  return [en, ar].map((loc) => `<url><loc>${loc}</loc>${meta}${alternates}</url>`).join("\n");
}

Deno.serve(async () => {
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // The catalog is larger than one 1000-row page, so read products page by page
    const allProducts = async () => {
      const rows: { slug: string; updated_at: string | null }[] = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase.from("products").select("slug, updated_at")
          .eq("is_active", true).order("slug").range(from, from + 999);
        if (error) throw error;
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      return { data: rows };
    };

    const [products, categories, projects, posts] = await Promise.all([
      allProducts(),
      supabase.from("categories").select("slug, updated_at").eq("is_active", true),
      supabase.from("projects").select("slug, updated_at").eq("is_active", true),
      supabase.from("blog_posts").select("slug, updated_at, published_at").eq("is_published", true),
    ]);

    const urls: string[] = STATIC_PAGES.map(([path, freq, prio]) => entry(path, null, freq, prio));
    for (const c of categories.data || []) urls.push(entry(`/shop?category=${encodeURIComponent(c.slug)}`, c.updated_at, "weekly", 0.8));
    for (const p of products.data || []) urls.push(entry(`/product/${encodeURIComponent(p.slug)}`, p.updated_at, "weekly", 0.8));
    for (const p of projects.data || []) urls.push(entry(`/project/${encodeURIComponent(p.slug)}`, p.updated_at, "monthly", 0.6));
    for (const b of posts.data || []) urls.push(entry(`/blog/${encodeURIComponent(b.slug)}`, b.updated_at || b.published_at, "monthly", 0.6));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("sitemap error:", error);
    return new Response("Sitemap temporarily unavailable", { status: 500 });
  }
});
