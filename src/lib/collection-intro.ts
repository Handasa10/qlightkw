import type { CatalogCategory } from '@/hooks/useCatalog';

interface IntroOptions {
  categories: CatalogCategory[];
  categorySlug: string;
  department?: { id: string; categories: string[] };
  isRTL: boolean;
  suppressed: boolean;
}

export function collectionIntro({ categories, categorySlug, department, isRTL, suppressed }: IntroOptions): string | null {
  if (suppressed) return null;
  const slug = categorySlug || (department?.id === 'bulbs' && department.categories.length === 1 ? department.categories[0] : '');
  if (slug !== 'led-bulbs-tubes' && slug !== 'chandelier') return null;
  const category = categories.find((item) => item.slug === slug);
  const text = isRTL ? category?.description_ar : category?.description_en;
  return text?.trim() || null;
}
