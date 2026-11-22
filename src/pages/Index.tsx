import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SwitchHero from '@/components/storefront/SwitchHero';
import RecentlyViewed from '@/components/storefront/RecentlyViewed';
import ConfiguratorBanner from '@/components/storefront/ConfiguratorBanner';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Banknote, Camera, FileSpreadsheet, MapPin, MessageCircle, Truck } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductRail from '@/components/storefront/ProductRail';
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';
import { priceOf, useCatalog, type CatalogProduct } from '@/hooks/useCatalog';
import { DEPARTMENTS } from '@/lib/store-nav';

const STORAGE = 'https://yubebbfsmlopmnluajgf.supabase.co/storage/v1/object/public/product-images';

const SLIDES = [
  {
    tag: { en: 'Offer', ar: 'عرض خاص' },
    title: { en: '40% off modern chandeliers', ar: 'خصم 40٪ على الثريات الحديثة' },
    text: { en: 'Crystal rings and statement pieces from our Hawalli showroom, delivered across Kuwait.', ar: 'حلقات كريستال وقطع مميزة من معرضنا في حولي، مع التوصيل لجميع مناطق الكويت.' },
    cta: { en: 'Shop chandeliers', ar: 'تسوق الثريات' },
    href: '/shop?category=chandelier',
    image: `${STORAGE}/chandeliers/gold-triple-crystal-rings.jpg`,
  },
  {
    tag: { en: 'Electrical', ar: 'كهربائيات' },
    title: { en: 'Switches, sockets and everything behind the wall', ar: 'مفاتيح وأفياش وكل ما يلزم التمديدات' },
    text: { en: 'Sockets, switches, double poles, junction boxes, breakers and boards in one place.', ar: 'أفياش، مفاتيح، دبل بول، علب توزيع، قواطع ولوحات في مكان واحد.' },
    cta: { en: 'Shop switches & sockets', ar: 'تسوق المفاتيح والأفياش' },
    href: '/shop?dept=switches-sockets',
    image: `${STORAGE}/studio/socket-13a-double-white.jpg`,
  },
  {
    tag: { en: 'Lighting', ar: 'إضاءة' },
    title: { en: 'LED lighting for every room', ar: 'إضاءة LED لكل غرفة' },
    text: { en: 'Spotlights, panels, magnetic track, LED strips and profiles at showroom prices.', ar: 'سبوت لايت، بانل، إضاءة مغناطيسية، شرائط LED وبروفايل بأسعار المعرض.' },
    cta: { en: 'Shop indoor lighting', ar: 'تسوق الإضاءة الداخلية' },
    href: '/shop?dept=indoor-lighting',
    image: `${STORAGE}/chandeliers/crystal-halo-ring-drum.jpg`,
  },
];

const Index = () => {
  const { isRTL } = useLanguage();
  const { products, loading } = useCatalog();
  const lang = isRTL ? 'ar' : 'en';
  useSEO({
    title: isRTL ? 'متجر الإضاءة والكهربائيات في الكويت | كواليتي لايت' : 'Lighting & Electrical Store in Kuwait | Quality Light',
    description: isRTL
      ? 'تسوق أونلاين: إضاءة LED، ثريات، سبوت لايت، شرائط LED، مفاتيح وأفياش، قواطع ولوازم التمديدات. توصيل لجميع مناطق الكويت والدفع عند الاستلام. معرضنا في حولي – شارع تونس.'
      : 'Shop online: LED lighting, chandeliers, spotlights, LED strips, switches and sockets, breakers and wiring accessories. Delivery across Kuwait, cash on delivery. Showroom on Tunis Street, Hawalli.',
  });

  const rails = useMemo(() => {
    // Products with a real or studio photo come first: they sell the store better than placeholders
    const ranked = [...products].sort((a, b) => Number(a.stock_photo) - Number(b.stock_photo) || Number(!!b.is_bestseller) - Number(!!a.is_bestseller));
    const priced = ranked.filter((p) => priceOf(p) > 0);
    const inDept = (id: string) => {
      const slugs = DEPARTMENTS.find((d) => d.id === id)!.categories;
      return priced.filter((p) => p.category_slug && slugs.includes(p.category_slug)).slice(0, 12);
    };
    return {
      offers: priced.filter((p) => p.sale_price && p.sale_price > 0 && p.sale_price < p.base_price).slice(0, 12),
      best: priced.filter((p) => p.is_bestseller).slice(0, 12),
      fresh: [...priced].filter((p) => p.is_new || !p.stock_photo).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')).slice(0, 12),
      dept: Object.fromEntries(DEPARTMENTS.map((d) => [d.id, inDept(d.id)])) as Record<string, CatalogProduct[]>,
    };
  }, [products]);

  // Each department tile shows one of its own products (a real or studio photo when there is one)
  const tiles = useMemo(() => DEPARTMENTS.map((d) => {
    const own = products.filter((p) => p.category_slug && d.categories.includes(p.category_slug));
    const pick = own.find((p) => !p.stock_photo) || own[0];
    return { ...d, image: pick?.image_url || null, count: own.length };
  }).filter((d) => d.count > 0), [products]);

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <StorefrontLayout>
      <SwitchHero />

      {/* Featured collections */}
      <section className="container pt-5">
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {SLIDES.map((s, i) => (
            <motion.div key={s.href} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={s.href} className="group relative flex h-56 overflow-hidden rounded-3xl bg-[#f5f5f6] md:h-64">
                <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative mt-auto p-5 text-white">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur">{s.tag[lang]}</span>
                  <p className="mt-2 text-lg font-extrabold leading-tight">{s.title[lang]}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/80">{s.cta[lang]}<Arrow className="h-3.5 w-3.5 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why shop here */}
      <section className="container py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Truck, en: 'Delivery across Kuwait', ar: 'توصيل لجميع مناطق الكويت' },
            { icon: Banknote, en: 'Cash on delivery', ar: 'الدفع عند الاستلام' },
            { icon: MapPin, en: 'Showroom in Hawalli', ar: 'معرضنا في حولي – شارع تونس' },
            { icon: MessageCircle, en: 'Help on WhatsApp', ar: 'مساعدة عبر واتساب' },
          ].map(({ icon: Icon, en, ar }) => (
            <div key={en} className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3.5">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-xs font-semibold text-neutral-800 md:text-sm">{isRTL ? ar : en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by department */}
      <section className="container py-8 md:py-10">
        <h2 className="mb-5 text-xl font-extrabold tracking-tight text-neutral-900 md:text-2xl">{isRTL ? 'تسوق حسب القسم' : 'Shop by department'}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
          {(loading ? DEPARTMENTS.map((d) => ({ ...d, image: null as string | null, count: 0 })) : tiles).map((d) => (
            <Link key={d.id} to={`/shop?dept=${d.id}`} className="group">
              <div className="aspect-square overflow-hidden rounded-2xl bg-[#f5f5f6]">
                {d.image && <img src={d.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <p className="mt-3 text-center text-sm font-bold text-neutral-900 group-hover:text-primary">{isRTL ? d.ar : d.en}</p>
            </Link>
          ))}
        </div>
      </section>

      <ConfiguratorBanner />
      <ProductRail title={isRTL ? 'العروض' : 'On offer'} products={rails.offers} href="/shop?offers=true" loading={loading} />
      <ProductRail title={isRTL ? 'الأكثر مبيعاً' : 'Best sellers'} products={rails.best} href="/shop?sort=best" loading={loading} />

      {/* Quotation banner */}
      <section className="container py-6">
        <div className="grid items-center gap-6 rounded-3xl bg-neutral-900 p-7 text-white md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{isRTL ? 'عندك قائمة مواد؟ صوّرها واحصل على عرض سعر' : 'Have a materials list? Snap it and get a quotation'}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              {isRTL ? 'ارفع ملف إكسل أو صوّر ورقة الطلب المكتوبة بخط اليد، ونجهّز لك عرض سعر رسمي خلال دقيقة.' : 'Upload an Excel sheet or photograph a handwritten list and get an official quotation in about a minute.'}
            </p>
            <div className="mt-4 flex gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5"><FileSpreadsheet className="h-4 w-4" />Excel / PDF</span>
              <span className="flex items-center gap-1.5"><Camera className="h-4 w-4" />{isRTL ? 'صورة' : 'Photo'}</span>
            </div>
          </div>
          <Link to="/quote" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-neutral-900">
            {isRTL ? 'اطلب عرض سعر' : 'Get a quotation'} <Arrow className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <ProductRail title={isRTL ? 'المفاتيح والأفياش' : 'Switches & sockets'} products={rails.dept['switches-sockets'] || []} href="/shop?dept=switches-sockets" loading={loading} />
      <ProductRail title={isRTL ? 'الإضاءة الداخلية' : 'Indoor lighting'} products={rails.dept['indoor-lighting'] || []} href="/shop?dept=indoor-lighting" loading={loading} />
      <RecentlyViewed />
      <ProductRail title={isRTL ? 'وصل حديثاً' : 'New in'} products={rails.fresh} href="/shop?sort=newest" loading={loading} />
      <ProductRail title={isRTL ? 'شرائط LED والبروفايل' : 'LED strips & profiles'} products={rails.dept['led-strips'] || []} href="/shop?dept=led-strips" loading={loading} />
      <ProductRail title={isRTL ? 'التمديدات والحماية' : 'Wiring & protection'} products={rails.dept.wiring || []} href="/shop?dept=wiring" loading={loading} />
      <ProductRail title={isRTL ? 'الإضاءة الخارجية' : 'Outdoor lighting'} products={rails.dept['outdoor-lighting'] || []} href="/shop?dept=outdoor-lighting" loading={loading} />
      <div className="h-8" />
    </StorefrontLayout>
  );
};

export default Index;
