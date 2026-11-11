// Shared SEO constants and structured-data (schema.org JSON-LD) builders.

export const SITE_URL = 'https://qlightkw.com';
export const SITE_NAME_EN = 'Quality Light Kuwait';
export const SITE_NAME_AR = 'كواليتي لايت الكويت';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Turns a site path into an absolute URL; Arabic pages carry ?lang=ar so they index separately
export function absoluteUrl(path: string, lang?: 'en' | 'ar', params: Record<string, string | null | undefined> = {}): string {
  const url = new URL(path, SITE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  if (lang === 'ar') url.searchParams.set('lang', 'ar');
  return url.toString();
}

export function absoluteImage(src: string | null | undefined): string {
  if (!src) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//.test(src)) return src;
  return new URL(src, SITE_URL).toString();
}

// The store (LocalBusiness) and WebSite schemas are static, in index.html.

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productSchema(p: {
  name: string;
  description?: string | null;
  images: string[];
  sku?: string | null;
  brand?: string | null;
  price: number;
  inStock: boolean;
  url: string;
  category?: string | null;
  // Approved customer reviews only; Google ignores (and penalises) made-up ratings
  reviews?: Array<{ rating: number; body: string; author_name: string; created_at: string }>;
}) {
  const reviews = p.reviews || [];
  // Google rejects a Product with neither an offer nor reviews, so price-on-request items
  // without reviews get no Product markup at all (their breadcrumbs remain)
  if (!(p.price > 0) && !reviews.length) return null;
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description || undefined,
    image: p.images.map(absoluteImage),
    sku: p.sku || undefined,
    category: p.category || undefined,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    aggregateRating: reviews.length
      ? { '@type': 'AggregateRating', ratingValue: average.toFixed(1), reviewCount: reviews.length, bestRating: 5, worstRating: 1 }
      : undefined,
    review: reviews.length
      ? reviews.slice(0, 10).map((r) => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          author: { '@type': 'Person', name: r.author_name },
          datePublished: r.created_at.slice(0, 10),
          reviewBody: r.body,
        }))
      : undefined,
    // Price-on-request items have no public price, so no Offer
    offers: !(p.price > 0) ? undefined : {
      '@type': 'Offer',
      url: p.url,
      priceCurrency: 'KWD',
      price: p.price.toFixed(3),
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#store` },
      areaServed: 'KW',
    },
  };
}

export function articleSchema(a: { title: string; description?: string | null; image?: string | null; url: string; published?: string | null; modified?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description || undefined,
    image: absoluteImage(a.image),
    url: a.url,
    datePublished: a.published || undefined,
    dateModified: a.modified || a.published || undefined,
    author: { '@type': 'Organization', name: 'Quality Light' },
    publisher: { '@id': `${SITE_URL}/#store` },
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
