import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '@/lib/image-resolver';
import { ArrowRight, Lightbulb } from 'lucide-react';
import SectionHeading from '@/components/effects/SectionHeading';
import { glowHandlers } from '@/components/effects/glow';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
}

const FeaturedCategories = () => {
  const { language, isRTL } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded target categories with high-end premium lighting images (matching seed_full_catalog.sql and Unsplash)
  // Featured collections (the ones with the most products in the catalog)
  const targetCategories = [
    {
      id: 'cat-1',
      name_en: 'Spotlights',
      name_ar: 'إضاءة سبوت لايت',
      slug: 'led-spot-light',
      image_url: 'https://images.unsplash.com/photo-1636891852883-862c06a10c90?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-2',
      name_en: 'Magnetic Track Lights',
      name_ar: 'إضاءة مغناطيسية',
      slug: 'magnetic-light',
      image_url: 'https://images.unsplash.com/photo-1526116638181-d787e552d669?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-3',
      name_en: 'LED Strips',
      name_ar: 'شرائط LED',
      slug: 'led-strip-light',
      image_url: 'https://images.unsplash.com/photo-1618403323851-ac3d38029495?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-4',
      name_en: 'Panel Lights',
      name_ar: 'إضاءة بانل',
      slug: 'led-panel-light',
      image_url: 'https://images.unsplash.com/photo-1641159930908-e9eb9ccdc002?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-5',
      name_en: 'Switches & Sockets',
      name_ar: 'مفاتيح وأفياش',
      slug: 'switches-sockets',
      image_url: 'https://images.unsplash.com/photo-1698768144235-b5dbe3043bb2?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-6',
      name_en: 'Breakers & Boards',
      name_ar: 'قواطع ولوحات توزيع',
      slug: 'breakers-distribution',
      image_url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-7',
      name_en: 'Cables & Wires',
      name_ar: 'كابلات وأسلاك',
      slug: 'cables-wires',
      image_url: 'https://images.unsplash.com/photo-1599256871679-6a154745680b?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-8',
      name_en: 'Ceiling Lighting',
      name_ar: 'إضاءة السقف',
      slug: 'ceiling-general-lighting',
      image_url: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600',
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const slugs = targetCategories.map(c => c.slug);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name_en, name_ar, slug, image_url')
          .in('slug', slugs);

        if (!error && data && data.length > 0) {
          // Merge database entries with fallback configurations to ensure images and translation properties are perfect
          const merged = targetCategories.map(target => {
            const dbMatch = data.find(d => d.slug === target.slug);
            return {
              ...target,
              id: dbMatch?.id || target.id,
              name_en: dbMatch?.name_en || target.name_en,
              name_ar: dbMatch?.name_ar || target.name_ar,
              image_url: dbMatch?.image_url || target.image_url,
            };
          });
          setCategories(merged);
        } else {
          setCategories(targetCategories);
        }
      } catch (err) {
        setCategories(targetCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="categories" className="relative scroll-mt-20 overflow-hidden bg-background py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />

      <div className="container relative z-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={isRTL ? 'مجموعاتنا المنسقة' : 'Our Collections'}
            title={isRTL ? 'تسوق حسب القسم' : 'Shop by Category'}
            description={isRTL
              ? 'مرّر فوق أي قسم لتشغيل الضوء. مجموعة واسعة من الإضاءة الفاخرة للمساحات السكنية والتجارية في الكويت.'
              : 'Hover over a collection to switch it on. Premium lighting for residential and commercial spaces across Kuwait.'}
          />
          <Link
            to="/shop"
            className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span>{isRTL ? 'عرض جميع المنتجات' : 'View All Products'}</span>
            <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
          </Link>
        </div>

        {loading ? (
          <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:gap-5 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className={`rounded-3xl ${BENTO_LAYOUT[i] || ''}`} />
            ))}
          </div>
        ) : (
          <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:gap-5 lg:grid-cols-4">
            {categories.map((category, index) => {
              const name = isRTL ? category.name_ar : category.name_en;
              const imgUrl = resolveImageUrl(category.image_url, 'category', category.slug);

              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`glow-card group overflow-hidden rounded-3xl bg-[#0b0907] shadow-lg ${BENTO_LAYOUT[index] || ''}`}
                  {...glowHandlers}
                >
                  <Link to={`/shop?category=${category.slug}`} className="absolute inset-0 block">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={name}
                        className="absolute inset-0 h-full w-full object-cover brightness-[0.45] saturate-[0.6] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                        <Lightbulb className="h-10 w-10 text-primary" />
                      </div>
                    )}

                    {/* Warm light that pools in from the top when the card is "switched on" */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,190,120,0.45),transparent_60%)] opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Light switch indicator */}
                    <div className="absolute end-4 top-4 z-20 flex h-6 w-11 items-center rounded-full border border-white/20 bg-black/40 p-0.5 backdrop-blur-md transition-colors duration-500 group-hover:border-primary/60 group-hover:bg-primary/30">
                      <span className="h-[18px] w-[18px] rounded-full bg-white/50 transition-all duration-500 group-hover:translate-x-5 group-hover:bg-white group-hover:shadow-[0_0_12px_rgba(255,200,140,1)] rtl:group-hover:-translate-x-5" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 md:p-6">
                      <span className="mb-1 block font-mono text-[10px] text-white/50">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className={`font-extrabold tracking-tight text-white ${index === 0 ? 'text-2xl md:text-4xl' : 'text-base md:text-xl'}`}>
                        {name}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
                        {isRTL ? 'تسوق الآن' : 'Shop now'}
                        <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

// Bento grid, filled without gaps:
//   desktop (4 cols)  0 0 1 2 / 0 0 3 4 / 5 6 6 7
//   mobile  (2 cols)  0 0 / 0 0 / 1 2 / 3 4 / 5 6 / 7 7
const BENTO_LAYOUT = [
  'col-span-2 row-span-2',
  '',
  '',
  '',
  '',
  '',
  'lg:col-span-2',
  'col-span-2 lg:col-span-1',
];

export default FeaturedCategories;
