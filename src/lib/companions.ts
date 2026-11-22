// "Complete the installation": products that are usually bought together with another one.
// Each rule matches the product just added (by name) and suggests items found by name.
import { priceOf, type CatalogProduct } from '@/hooks/useCatalog';

interface Rule {
  when: RegExp;
  suggest: RegExp[];
  why: { en: string; ar: string };
}

const RULES: Rule[] = [
  { when: /switch|socket|dimmer|سوتش|بلاك|ديمر/i, suggest: [/^box steel 3\*3$/i, /ring box 3\*3/i, /^blank plate 3\*3$/i, /^wire 2\.5mm gulf$/i], why: { en: 'Back box and wire for the installation', ar: 'علبة التركيب والسلك اللازم' } },
  { when: /gu10/i, suggest: [/ql gu10 frame 7cm/i, /gu10 holder/i, /frame gu 7cm/i], why: { en: 'A frame and holder for the bulb', ar: 'فريم وهولدر للمبة' } },
  { when: /frame|frem|anti-?glare/i, suggest: [/ql gu10 7w 3000k/i, /ql gu10 9w 3000k/i, /gu10 holder/i], why: { en: 'A GU10 bulb for the frame', ar: 'لمبة GU10 للفريم' } },
  { when: /strip|rope|استرب|روب/i, suggest: [/24v driver 300w/i, /profile 17\*7/i, /connector strip light/i, /anti-flicker/i], why: { en: 'Driver and profile for the strip', ar: 'محول وبروفايل للشريط' } },
  { when: /\bmg\b|magnetic|magnatic/i, suggest: [/track magnetic 2m/i, /ql mg driver 200w/i, /ql mg connector$/i, /ql mg cornar/i], why: { en: 'Track, driver and connectors', ar: 'المسار والمحول والوصلات' } },
  { when: /breaker|mcb|mccb|tp\b|triple pole/i, suggest: [/db 6-way double busbar/i, /^busbar$/i, /earth leakage 40\/30 - 2-pole/i], why: { en: 'Board and protection', ar: 'لوحة التوزيع والحماية' } },
  { when: /panel|60\*60/i, suggest: [/clip 60\*60/i, /box 60\*60/i], why: { en: 'Mounting accessories', ar: 'ملحقات التركيب' } },
  { when: /driver|transformer|محول/i, suggest: [/ql strip 12v 10 w 3000k/i, /ql 24v strip smd ip20 10w 3000k$/i], why: { en: 'LED strip for the driver', ar: 'شريط LED للمحول' } },
];

export interface Companion { product: CatalogProduct; why: { en: string; ar: string } }

export function companionsFor(name: string, catalog: CatalogProduct[], excludeIds: string[] = [], limit = 4): Companion[] {
  const rule = RULES.find((r) => r.when.test(name));
  if (!rule) return [];
  const out: Companion[] = [];
  for (const re of rule.suggest) {
    const hit = catalog.find((p) => re.test(p.name_en) && priceOf(p) > 0 && !excludeIds.includes(p.id) && !out.some((o) => o.product.id === p.id));
    if (hit) out.push({ product: hit, why: rule.why });
    if (out.length >= limit) break;
  }
  return out;
}
