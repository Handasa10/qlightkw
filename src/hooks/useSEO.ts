import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_NAME_AR, SITE_NAME_EN, absoluteImage, absoluteUrl } from '@/lib/seo';

interface SEOOptions {
  title: string;
  description: string;
  image?: string | null;
  type?: 'website' | 'product' | 'article';
  // Query parameters that define this page's identity (e.g. ?category=), kept in canonical URLs
  params?: Record<string, string | null | undefined>;
  // Private pages (cart, checkout, account, admin) must not be indexed
  noindex?: boolean;
  jsonLd?: object | object[] | null;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

// Sets the page title, description, canonical + hreflang links, social preview tags and
// structured data for the current page, in the visitor's language.
export function useSEO({ title, description, image, type = 'website', params, noindex, jsonLd }: SEOOptions) {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const paramsKey = JSON.stringify(params || {});
  const jsonLdKey = JSON.stringify(jsonLd || null);

  useEffect(() => {
    const siteName = language === 'ar' ? SITE_NAME_AR : SITE_NAME_EN;
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const desc = description.replace(/\s+/g, ' ').trim().slice(0, 160);
    const pageParams = JSON.parse(paramsKey) as Record<string, string>;
    const canonical = absoluteUrl(pathname, language, pageParams);
    const ogImage = absoluteImage(image);

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    setLink('canonical', canonical);
    setLink('alternate', absoluteUrl(pathname, 'en', pageParams), 'en');
    setLink('alternate', absoluteUrl(pathname, 'ar', pageParams), 'ar');
    setLink('alternate', absoluteUrl(pathname, 'en', pageParams), 'x-default');

    setMeta('property', 'og:type', type === 'article' ? 'article' : type === 'product' ? 'product' : 'website');
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:locale', language === 'ar' ? 'ar_KW' : 'en_KW');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', ogImage);

    // Page-specific structured data lives in its own script tag, replaced per page
    const existing = document.getElementById('page-jsonld');
    existing?.remove();
    const data = JSON.parse(jsonLdKey);
    if (data) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-jsonld';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }, [title, description, image, type, noindex, language, pathname, paramsKey, jsonLdKey]);
}
