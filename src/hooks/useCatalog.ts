import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl, resolveSecondaryImageUrl } from '@/lib/image-resolver';

export interface CatalogProduct {
  id: string;
  sku: string | null;
  name_en: string;
  name_ar: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  is_featured: boolean | null;
  category_id: string | null;
  category_slug: string | null;
  created_at: string | null;
  image_url: string | null;
  secondary_image_url: string | null;
  // True when the main photo is only a stock placeholder
  stock_photo: boolean;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
}

interface ImageRow { url: string; is_primary: boolean | null; sort_order: number | null }

// The whole active catalog, loaded once and shared by the home page, collections and search.
// Supabase returns at most 1000 rows per request, so products are read page by page.
async function loadCatalog(): Promise<{ products: CatalogProduct[]; categories: CatalogCategory[] }> {
  const { data: categories, error: catError } = await supabase
    .from('categories').select('id, slug, name_en, name_ar').eq('is_active', true);
  if (catError) throw catError;
  const slugOf = new Map((categories || []).map((c) => [c.id, c.slug]));

  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('products')
      .select('id, sku, name_en, name_ar, slug, base_price, sale_price, is_new, is_bestseller, is_featured, category_id, created_at, product_images(url, is_primary, sort_order)')
      .eq('is_active', true)
      .order('id')
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }

  const products = rows.map((row) => {
    const { product_images, ...p } = row as Record<string, unknown> & { product_images: ImageRow[] | null };
    const images = [...(product_images || [])].sort(
      (a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    const primary = images[0]?.url || null;
    const secondary = images.find((i) => i.url !== primary)?.url || null;
    return {
      ...(p as unknown as Omit<CatalogProduct, 'category_slug' | 'image_url' | 'secondary_image_url' | 'stock_photo'>),
      base_price: Number(p.base_price) || 0,
      sale_price: p.sale_price == null ? null : Number(p.sale_price),
      category_slug: slugOf.get(p.category_id as string) || null,
      image_url: resolveImageUrl(primary, 'product', p.slug as string),
      secondary_image_url: resolveSecondaryImageUrl(secondary, p.slug as string),
      stock_photo: !primary || primary.startsWith('https://images.unsplash.com/'),
    } as CatalogProduct;
  });

  return { products, categories: (categories || []) as CatalogCategory[] };
}

export function useCatalog() {
  const query = useQuery({ queryKey: ['store-catalog'], queryFn: loadCatalog, staleTime: 5 * 60 * 1000 });
  return {
    products: query.data?.products || [],
    categories: query.data?.categories || [],
    loading: query.isLoading,
  };
}

export const priceOf = (p: Pick<CatalogProduct, 'base_price' | 'sale_price'>) => (p.sale_price && p.sale_price > 0 ? p.sale_price : p.base_price);

// Arabic letters people type in different ways are folded before matching
const fold = (s: string) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/(\d)\s*[x×*]\s*(\d)/g, '$1x$2');

// Every word must appear (any order) in the English name, Arabic name or item code
export function searchCatalog(products: CatalogProduct[], text: string): CatalogProduct[] {
  const words = fold(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return products.filter((p) => {
    const hay = fold(`${p.name_en} ${p.name_ar} ${p.sku || ''}`);
    return words.every((w) => hay.includes(w));
  });
}
