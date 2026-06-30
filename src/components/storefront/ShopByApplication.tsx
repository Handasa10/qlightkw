import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Home, Briefcase, ShoppingBag, Palmtree, Hotel, ArrowUpRight } from 'lucide-react';

interface ApplicationItem {
  id: string;
  nameEn: string;
  nameAr: string;
  tagQuery: string;
  imageUrl: string;
  icon: React.ReactNode;
  descriptionEn: string;
  descriptionAr: string;
}

const ShopByApplication = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const applications: ApplicationItem[] = [
    {
      id: 'app-villas',
      nameEn: 'Villas & Residential',
      nameAr: 'الفلل والقصور السكنية',
      tagQuery: 'recessed', // search query or tag
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      icon: <Home className="h-6 w-6" />,
      descriptionEn: 'Luxury chandeliers, downlights and outdoor wall wash lights for high-end homes.',
      descriptionAr: 'ثريات فاخرة، إضاءات أسقف غائرة، وإضاءات جدارية خارجية للمنازل الفاخرة.'
    },
    {
      id: 'app-offices',
      nameEn: 'Corporate Offices',
      nameAr: 'المكاتب والشركات',
      tagQuery: 'linear',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
      icon: <Briefcase className="h-6 w-6" />,
      descriptionEn: 'Modern linear lights and panel lighting for glare-free, productive work spaces.',
      descriptionAr: 'إضاءات خطية حديثة وإضاءات لوحية (بانل) لمساحات عمل منتجة ومريحة للعين.'
    },
    {
      id: 'app-shops',
      nameEn: 'Retail Shops & Showrooms',
      nameAr: 'المحلات والمعارض التجارية',
      tagQuery: 'track',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      icon: <ShoppingBag className="h-6 w-6" />,
      descriptionEn: 'High-CRI track lights and magnetic spotlight systems to illuminate merchandise.',
      descriptionAr: 'إضاءات مسار (تراك لايت) عالية الدقة وإضاءات مغناطيسية لإبراز المنتجات التجارية.'
    },
    {
      id: 'app-outdoor',
      nameEn: 'Landscape & Garden',
      nameAr: 'الحدائق والمساحات الخارجية',
      tagQuery: 'outdoor',
      imageUrl: 'https://images.unsplash.com/photo-1508615070457-7baebe4003ab?auto=format&fit=crop&q=80&w=800',
      icon: <Palmtree className="h-6 w-6" />,
      descriptionEn: 'Weatherproof bollards, floodlights, and solar pathway markers for landscapes.',
      descriptionAr: 'أعمدة حدائق مقاومة للعوامل الجوية، كشافات إضاءة، وإضاءات شمسية للممرات.'
    },
    {
      id: 'app-hospitality',
      nameEn: 'Hospitality & Restaurants',
      nameAr: 'الفنادق والمطاعم الفاخرة',
      tagQuery: 'chandelier',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      icon: <Hotel className="h-6 w-6" />,
      descriptionEn: 'Warm decorative lighting, wall sconces and artistic fixtures for a premium ambiance.',
      descriptionAr: 'إضاءة ديكورية دافئة، مصابيح جدارية، وتجهيزات فنية لخلق أجواء استثنائية.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] dark:bg-slate-950/40 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d97706]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            {isRTL ? "تسوق حسب طبيعة مشروعك" : "Curated By Use-Case"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isRTL ? "تسوق حسب التطبيق والمشروع" : "Shop by Application"}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isRTL 
              ? "ابحث عن تجهيزات الإضاءة المثالية المصممة والمصنفة خصيصاً لتناسب الاحتياجات الفنية والجمالية لنوع مشروعك."
              : "Discover the perfect lighting fixtures selected and categorized to match the architectural and technical needs of your project type."}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {applications.map((app, index) => {
            const name = isRTL ? app.nameAr : app.nameEn;
            const desc = isRTL ? app.descriptionAr : app.descriptionEn;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border/80 shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-[350px] lg:h-[400px]"
              >
                {/* Image Section */}
                <div className="relative h-1/2 overflow-hidden shrink-0">
                  <img
                    src={app.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10 z-10" />
                  
                  {/* Icon over image */}
                  <div className="absolute top-4 left-4 z-20 h-10 w-10 bg-black/60 backdrop-blur-md text-primary rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    {app.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between flex-1 bg-card">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  
                  <Link
                    to={`/shop?q=${app.tagQuery}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-4 self-start"
                  >
                    <span>{isRTL ? "استكشف المنتجات" : "Explore Products"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByApplication;
