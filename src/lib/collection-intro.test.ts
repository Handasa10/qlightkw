import { describe, it, expect } from 'vitest';
import { collectionIntro } from './collection-intro';
import type { CatalogCategory } from '@/hooks/useCatalog';

const categories: CatalogCategory[] = ['led-bulbs-tubes', 'chandelier', 'pendant-lighting'].map((slug) => ({ id: slug, slug, name_en: slug, name_ar: slug, description_en: 'English ' + slug, description_ar: 'عربي ' + slug }));
const options = { categories, categorySlug: 'led-bulbs-tubes', isRTL: false, suppressed: false };
describe('priority collection introductions', () => {
  it('uses the bulb category English description', () => expect(collectionIntro(options)).toBe('English led-bulbs-tubes'));
  it('uses the Arabic description', () => expect(collectionIntro({ ...options, isRTL: true })).toBe('عربي led-bulbs-tubes'));
  it('uses the chandelier category', () => expect(collectionIntro({ ...options, categorySlug: 'chandelier' })).toBe('English chandelier'));
  it('supports the single-category bulb department', () => expect(collectionIntro({ ...options, categorySlug: '', department: { id: 'bulbs', categories: ['led-bulbs-tubes'] } })).toBe('English led-bulbs-tubes'));
  it('does not generalize a chandelier description to its department', () => expect(collectionIntro({ ...options, categorySlug: '', department: { id: 'decorative-lighting', categories: ['chandelier', 'pendant-lighting'] } })).toBeNull());
  it('does not show a bulb introduction if the department gains other categories', () => expect(collectionIntro({ ...options, categorySlug: '', department: { id: 'bulbs', categories: ['led-bulbs-tubes', 'other'] } })).toBeNull());
  it('suppresses search and filtered views', () => expect(collectionIntro({ ...options, suppressed: true })).toBeNull());
  it('does not change other categories', () => expect(collectionIntro({ ...options, categorySlug: 'pendant-lighting' })).toBeNull());
  it('handles a loading category list', () => expect(collectionIntro({ ...options, categories: [] })).toBeNull());
  it('handles empty descriptions without fallback claims', () => expect(collectionIntro({ ...options, categories: [{ ...categories[0], description_en: null }] })).toBeNull());
});
