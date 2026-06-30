import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '@/lib/image-resolver';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string | null;
}

const FeaturedCategories = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded target categories with high-end premium lighting images (matching seed_full_catalog.sql and Unsplash)
  const targetCategories = [
    {
      id: 'cat-1',
      name_en: 'Spotlights',
      name_ar: 'إضاءة سبوت لايت',
      slug: 'led-spot-light',
      image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-2',
      name_en: 'Downlights',
      name_ar: 'إضاءة داون لايت',
      slug: 'led-downlight',
      image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-3',
      name_en: 'Track Lights',
      name_ar: 'إضاءة المسار (تراك)',
      slug: 'magnetic-light',
      image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-4',
      name_en: 'Outdoor Lights',
      name_ar: 'إضاءة خارجية',
      slug: 'outdoor-lights',
      image_url: 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-5',
      name_en: 'Chandeliers',
      name_ar: 'ثريات فاخرة',
      slug: 'chandelier',
      image_url: 'https://images.unsplash.com/photo-1572912353188-a5d0aeefaa68?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-6',
      name_en: 'Wall Lights',
      name_ar: 'إضاءة جدارية',
      slug: 'indoor-wall-light',
      image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-7',
      name_en: 'LED Strips',
      name_ar: 'شرائط LED',
      slug: 'led-strip-light',
      image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'cat-8',
      name_en: 'Panel Lights',
      name_ar: 'إضاءة بانل',
      slug: 'led-panel-light',
      image_url: 'https://images.unsplash.com/photo-1606103658514-6830a687ef7f?auto=format&fit=crop&q=80&w=600',
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
    <section id="categories" className="py-20 md:py-28 bg-background relative overflow-hidden scroll-mt-20">
      {/* Decorative background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
              {isRTL ? "مجموعاتنا المنسقة" : "Our Collections"}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {isRTL ? "تسوق حسب القسم" : "Shop by Category"}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              {isRTL 
                ? "اختر من بين مجموعتنا الواسعة من خيارات الإضاءة الفاخرة المصممة خصيصاً للمساحات السكنية والتجارية في الكويت."
                : "Explore our wide range of premium lighting collections crafted to illuminate residential and commercial spaces across Kuwait."}
            </p>
          </div>
          <Link 
            to="/shop" 
            className="group/btn inline-flex items-center gap-2 font-bold text-sm text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            <span>{isRTL ? "عرض جميع المنتجات" : "View All Products"}</span>
            <ArrowRight className={`h-4 w-4 transition-transform group-hover/btn:translate-x-1 ${isRTL ? 'rotate-185' : ''}`} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden relative">
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const name = isRTL ? category.name_ar : category.name_en;
              const imgUrl = resolveImageUrl(category.image_url, 'category', category.slug);

              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-slate-900 border border-slate-200/10 dark:border-white/5 hover:border-primary/50 shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <Link to={`/shop?category=${category.slug}`} className="absolute inset-0 block">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition-colors duration-500 z-10" />

                    {/* Image */}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                        <Lightbulb className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                    )}

                    {/* Gradient background cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-15" />

                    {/* Text card description */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col items-center text-center">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl max-w-full shadow-lg group-hover:bg-primary group-hover:border-primary/20 transition-all duration-300 transform group-hover:-translate-y-1">
                        <h3 className="font-bold text-sm md:text-base text-white tracking-wide truncate">
                          {name}
                        </h3>
                        <span className="text-[10px] text-primary-foreground/75 font-semibold mt-0.5 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden block transition-opacity duration-300">
                          {isRTL ? "تسوق الآن" : "Shop Now"}
                        </span>
                      </div>
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

export default FeaturedCategories;
