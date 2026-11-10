// The store's department tree: each department groups catalog categories (by slug).
// Used by the header menu, the home page tiles and the collection page.

export interface Department {
  id: string;
  en: string;
  ar: string;
  // Catalog category slugs, most important first
  categories: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'indoor-lighting', en: 'Indoor Lighting', ar: 'الإضاءة الداخلية',
    categories: ['led-spot-light', 'led-downlight', 'led-panel-light', 'ceiling-general-lighting', 'magnetic-light', 'linear-light', 'indoor-wall-light', 'led-stair-lights', 'professional-lighting'],
  },
  {
    id: 'decorative-lighting', en: 'Chandeliers & Decorative', ar: 'الثريات والإضاءة الديكورية',
    categories: ['chandelier', 'pendant-lighting', 'accent-decorative-lighting'],
  },
  {
    id: 'led-strips', en: 'LED Strips & Profiles', ar: 'شرائط LED والبروفايل',
    categories: ['led-strip-light', 'aluminum-profile', 'lighting-accessories'],
  },
  {
    id: 'bulbs', en: 'Bulbs & Tubes', ar: 'اللمبات والتيوبات',
    categories: ['led-bulbs-tubes'],
  },
  {
    id: 'outdoor-lighting', en: 'Outdoor Lighting', ar: 'الإضاءة الخارجية',
    categories: ['led-flood-light', 'led-outdoor-wall-light', 'led-garden-light', 'solar-lights', 'high-bay-light', 'led-street-light'],
  },
  {
    id: 'switches-sockets', en: 'Switches & Sockets', ar: 'المفاتيح والأفياش',
    categories: ['switches-sockets', 'extension-socket', 'smart-control', 'sensor-switch'],
  },
  {
    id: 'wiring', en: 'Wiring & Protection', ar: 'التمديدات والحماية',
    categories: ['wiring-accessories', 'breakers-distribution', 'cables-wires'],
  },
  {
    id: 'fans', en: 'Fans', ar: 'المراوح',
    categories: ['household-fan', 'ventilation-fan'],
  },
];

export const departmentById = (id: string | null | undefined) => DEPARTMENTS.find((d) => d.id === id);
export const departmentOfCategory = (slug: string | null | undefined) => DEPARTMENTS.find((d) => slug && d.categories.includes(slug));

// Stock photos (placeholders) versus real or studio photos
export const isStockPhoto = (url: string | null | undefined) => !url || url.startsWith('https://images.unsplash.com/');
// AI studio images are illustrative: the product page says so
export const isStudioImage = (url: string | null | undefined) => !!url && url.includes('/product-images/studio/');
