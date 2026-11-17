import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { priceOf, useCatalog, type CatalogProduct } from '@/hooks/useCatalog';

const STUDIO = 'https://yubebbfsmlopmnluajgf.supabase.co/storage/v1/object/public/product-images/studio';

type Kind = 'switch' | 'socket' | 'usb' | 'dimmer' | 'dp';
type Finish = 'white' | 'black' | 'gold' | 'chrome' | 'grey';

const KINDS: Array<{ id: Kind; en: string; ar: string; icon: string }> = [
  { id: 'switch', en: 'Light switch', ar: 'مفتاح إنارة', icon: '⏻' },
  { id: 'socket', en: '13A socket', ar: 'فيش 13 أمبير', icon: '🔌' },
  { id: 'usb', en: 'Socket with USB', ar: 'فيش مع USB', icon: '🔋' },
  { id: 'dimmer', en: 'Dimmer', ar: 'ديمر', icon: '🎚️' },
  { id: 'dp', en: 'Double pole 20A', ar: 'دبل بول 20 أمبير', icon: '⚡' },
];

const FINISHES: Array<{ id: Finish; en: string; ar: string; swatch: string }> = [
  { id: 'white', en: 'White', ar: 'أبيض', swatch: 'linear-gradient(135deg,#ffffff,#e5e5e5)' },
  { id: 'black', en: 'Black', ar: 'أسود', swatch: 'linear-gradient(135deg,#3a3a3a,#0a0a0a)' },
  { id: 'gold', en: 'Gold', ar: 'ذهبي', swatch: 'linear-gradient(135deg,#f3dc9a,#b8892f)' },
  { id: 'chrome', en: 'Chrome', ar: 'كروم', swatch: 'linear-gradient(135deg,#ffffff,#9ca3af,#f3f4f6)' },
  { id: 'grey', en: 'Grey', ar: 'رمادي', swatch: 'linear-gradient(135deg,#9ca3af,#4b5563)' },
];

const GANGS: Record<Kind, number[]> = { switch: [1, 2, 3, 4, 6], dimmer: [1, 2, 3, 4], socket: [1, 2], usb: [1, 2], dp: [1] };

const COLOUR_WORDS: Record<Finish, RegExp> = {
  white: /white|ابيض|أبيض/i, black: /black|اسود|أسود/i, gold: /gold|ذهب|دهب/i, chrome: /chrome|steel|كروم/i, grey: /grey|gray|رماد/i,
};
const ANY_COLOUR = /black|gold|chrome|steel|grey|gray|اسود|أسود|ذهب|دهب|كروم|رماد/i;
const gangOf = (n: string) => Number((n.match(/(\d)\s*-?\s*gang/i) || n.match(/ابو\s*(\d)/) || n.match(/(\d)\s*كبس/) || [])[1] || 0);

function matches(p: CatalogProduct, kind: Kind, gangs: number, finish: Finish) {
  const n = `${p.name_en} ${p.name_ar}`;
  const colourOk = finish === 'white' ? !ANY_COLOUR.test(n) || COLOUR_WORDS.white.test(n) : COLOUR_WORDS[finish].test(n);
  if (!colourOk) return false;
  switch (kind) {
    case 'switch':
      return /switch|سوتش|gang|كبس/i.test(n) && !/dimmer|ديمر|socket|بلاك|smart|bell|جرس|shutter|double pole|20a|45a|40a|blank|cover|frame|box/i.test(n) && (gangOf(n) || 1) === gangs;
    case 'dimmer':
      return /dimmer|ديمر/i.test(n) && !/rope|smart|wifi|bulb/i.test(n) && (gangOf(n) || 1) === gangs;
    case 'socket':
      return /socket|بلاك|13a/i.test(n) && !/usb|15a|data|tel|internet|satel|tv|w\/p|smart|extension|head|plug/i.test(n) && (gangs === 2 ? /double|دبل|twin/i.test(n) : !/double|دبل|twin/i.test(n));
    case 'usb':
      return /usb|يو اس ب/i.test(n) && /socket|بلاك/i.test(n) && (gangs === 2 ? /double|دبل/i.test(n) : !/double|دبل/i.test(n));
    case 'dp':
      return /double pole|d\/p|\bdp\b|20a.*(switch|flush)|insijam 20a|دبل بول/i.test(n);
  }
}

// The studio image for the current choice, with sensible fallbacks
function previewCandidates(kind: Kind, gangs: number, finish: Finish): string[] {
  const keys: string[] = [];
  if (kind === 'switch') keys.push(`switch-${gangs}-${finish}`, `switch-${gangs}-${finish}-wide`, `switch-${gangs}-white`, 'switch-1-white');
  if (kind === 'dimmer') keys.push(`dimmer-${gangs}-${finish}`, `dimmer-${gangs}-white`, 'dimmer-1-white');
  if (kind === 'socket') keys.push(`socket-13a-${gangs === 2 ? 'double' : 'single'}-${finish}`, `socket-13a-${gangs === 2 ? 'double' : 'single'}-white`);
  if (kind === 'usb') keys.push(`socket-usb-${gangs === 2 ? 'double' : 'single'}`, 'socket-usb-single');
  if (kind === 'dp') keys.push(`dp-switch-20a-${finish}`, 'dp-switch-20a-white');
  return [...new Set(keys)].map((k) => `${STUDIO}/${k}.jpg`);
}

const Preview = ({ candidates, label }: { candidates: string[]; label: string }) => {
  const [index, setIndex] = useState(0);
  const key = candidates.join('|');
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) { setLastKey(key); setIndex(0); }
  // Gentle 3D tilt that follows the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  return (
    <div className="relative" style={{ perspective: 1000 }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative aspect-square overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]">
        <AnimatePresence mode="wait">
          <motion.img key={candidates[index]} src={candidates[index]} alt={label} onError={() => setIndex((i) => Math.min(i + 1, candidates.length - 1))}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.35 }} />
        </AnimatePresence>
      </motion.div>
      <p className="mt-3 text-center text-xs text-neutral-400">{label}</p>
    </div>
  );
};

// Switch & socket designer: pick type, size and finish; see it and buy the matching product
const Configure = () => {
  const { isRTL } = useLanguage();
  const { products, loading } = useCatalog();
  const [kind, setKind] = useState<Kind>('switch');
  const [gangs, setGangs] = useState(2);
  const [finish, setFinish] = useState<Finish>('white');
  useSEO({
    title: isRTL ? 'صمّم مفتاحك أو فيشك | كواليتي لايت' : 'Design Your Switch or Socket | Quality Light',
    description: isRTL ? 'اختر نوع المفتاح أو الفيش وعدد الأزرار واللون، وشاهد النتيجة والسعر فوراً.' : 'Choose the switch or socket type, number of buttons and finish, and see it with the price instantly.',
  });

  const gangOptions = GANGS[kind];
  const g = gangOptions.includes(gangs) ? gangs : gangOptions[0];
  const kindLabel = KINDS.find((k) => k.id === kind)!;
  const finishLabel = FINISHES.find((f) => f.id === finish)!;

  const results = useMemo(() => products
    .filter((p) => p.category_slug === 'switches-sockets' || p.category_slug === 'smart-control')
    .filter((p) => matches(p, kind, g, finish))
    .sort((a, b) => Number(priceOf(b) > 0) - Number(priceOf(a) > 0) || priceOf(a) - priceOf(b)), [products, kind, g, finish]);

  const sizeLabel = (n: number) => kind === 'socket' || kind === 'usb'
    ? (n === 2 ? (isRTL ? 'دبل' : 'Double') : (isRTL ? 'سنجل' : 'Single'))
    : (isRTL ? `${n} ${n === 1 ? 'زر' : 'أزرار'}` : `${n} gang`);
  const summary = `${isRTL ? kindLabel.ar : kindLabel.en} · ${gangOptions.length > 1 ? `${sizeLabel(g)} · ` : ''}${isRTL ? finishLabel.ar : finishLabel.en}`;
  const ask = `https://wa.me/96551111725?text=${encodeURIComponent(isRTL ? `السلام عليكم، أبحث عن: ${summary}` : `Hello, I am looking for: ${summary}`)}`;

  const pill = (activeNow: boolean) => `relative rounded-full px-4 py-2.5 text-sm font-semibold transition ${activeNow ? 'text-white' : 'text-neutral-700 hover:text-neutral-900'}`;

  return (
    <StorefrontLayout>
      <div className="container py-8 md:py-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" />{isRTL ? 'مصمّم المفاتيح والأفياش' : 'Switch & socket designer'}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">{isRTL ? 'صمّمه كما تريده' : 'Design it your way'}</h1>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-48"><Preview candidates={previewCandidates(kind, g, finish)} label={summary} /></div>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-bold">1. {isRTL ? 'النوع' : 'Type'}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {KINDS.map((k) => (
                  <motion.button key={k.id} type="button" whileTap={{ scale: 0.95 }} onClick={() => setKind(k.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition ${kind === k.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'}`}>
                    <span className="text-2xl">{k.icon}</span>{isRTL ? k.ar : k.en}
                  </motion.button>
                ))}
              </div>
            </div>

            {gangOptions.length > 1 && (
              <div>
                <p className="mb-3 text-sm font-bold">2. {kind === 'socket' || kind === 'usb' ? (isRTL ? 'الحجم' : 'Size') : (isRTL ? 'عدد الأزرار' : 'Buttons')}</p>
                <div className="inline-flex flex-wrap gap-1 rounded-full bg-[#f5f5f6] p-1">
                  {gangOptions.map((n) => (
                    <button key={n} type="button" onClick={() => setGangs(n)} className={pill(g === n)}>
                      {g === n && <motion.span layoutId="gang-pill" className="absolute inset-0 rounded-full bg-neutral-900" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                      <span className="relative">{sizeLabel(n)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-sm font-bold">{gangOptions.length > 1 ? 3 : 2}. {isRTL ? 'اللون' : 'Finish'}</p>
              <div className="flex flex-wrap gap-4">
                {FINISHES.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFinish(f.id)} className="flex flex-col items-center gap-1.5 text-xs font-semibold">
                    <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`h-12 w-12 rounded-full border border-neutral-200 shadow-inner ring-2 ring-offset-2 transition ${finish === f.id ? 'ring-neutral-900' : 'ring-transparent'}`} style={{ background: f.swatch }} />
                    <span className={finish === f.id ? 'text-neutral-900' : 'text-neutral-500'}>{isRTL ? f.ar : f.en}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold">{isRTL ? 'المنتجات المطابقة' : 'Matching products'}</p>
                <p className="text-xs text-neutral-500">{loading ? '…' : `${results.length}`}</p>
              </div>
              {!loading && results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-neutral-600">{isRTL ? 'هذا التصميم غير متوفر أونلاين حالياً، لكن قد نوفره لك.' : 'This exact design isn’t online yet, but we may have it for you.'}</p>
                  <a href={ask} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><MessageCircle className="h-4 w-4" />{isRTL ? 'اسألنا عبر واتساب' : 'Ask us on WhatsApp'}</a>
                </div>
              ) : (
                <motion.div layout className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {results.slice(0, 9).map((p) => (
                      <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Configure;
