import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Headphones, Coins, Wrench } from 'lucide-react';

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const features = [
    {
      key: 'premiumQuality',
      icon: <ShieldCheck className="h-7 w-7 text-amber-500" />,
      title: isRTL ? 'جودة فائقة ومضمونة' : 'Premium Quality',
      description: isRTL 
        ? 'منتجات إضاءة مطابقة لأعلى المعايير العالمية مع كفالة حقيقية.' 
        : 'Lighting fixtures matching top global standards, backed by premium warranties.',
    },
    {
      key: 'competitivePrices',
      icon: <Coins className="h-7 w-7 text-amber-500" />,
      title: isRTL ? 'أسعار تنافسية مدروسة' : 'Competitive Prices',
      description: isRTL 
        ? 'نوفر أفضل الأسعار للمشاريع وتجارة التجزئة والجملة في السوق الكويتي.' 
        : 'Unmatched wholesale and retail rates matching every project scale in Kuwait.',
    },
    {
      key: 'fastDelivery',
      icon: <Truck className="h-7 w-7 text-amber-500" />,
      title: isRTL ? 'توصيل سريع وآمن' : 'Fast Delivery',
      description: isRTL 
        ? 'توصيل سريع وموثوق لجميع مناطق الكويت مباشرة إلى منزلك أو موقع العمل.' 
        : 'Quick, safe and tracked logistics straight to your home or construction site.',
    },
    {
      key: 'technicalSupport',
      icon: <Headphones className="h-7 w-7 text-amber-500" />,
      title: isRTL ? 'دعم فني متكامل' : 'Technical Support',
      description: isRTL 
        ? 'فريق من المهندسين لمساعدتك في تخطيط وحسابات شدة الإضاءة للمساحة.' 
        : 'Dedicated engineers to assist you with lux calculations and architectural lighting planning.',
    },
    {
      key: 'installationConsultation',
      icon: <Wrench className="h-7 w-7 text-amber-500" />,
      title: isRTL ? 'استشارة تركيب هندسية' : 'Installation Consultation',
      description: isRTL 
        ? 'استشارات فنية مجانية حول قياسات فتحات السقف وتوزيع الأحمال والأسلاك.' 
        : 'Expert advisory on ceiling cutout sizes, beam distribution, and driver configuration.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#fdfdfd] dark:bg-slate-900/10 relative overflow-hidden">
      {/* Decorative gradient background shapes */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            {isRTL ? "لماذا كواليتي لايت؟" : "The Quality Light Difference"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isRTL ? "لماذا يثق بنا العملاء؟" : "Why QUALITY LIGHT"}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {isRTL 
              ? "نحن ملتزمون بتقديم أفضل حلول الإضاءة المبتكرة لعملائنا في الكويت، من مشاريع الفلل السكنية الفخمة إلى المباني التجارية الضخمة."
              : "We are committed to delivering premium engineering and product excellence to both retail customers and contractors in the Kuwait market."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-card rounded-2xl p-6 text-center border border-border/80 hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-start items-center group relative overflow-hidden"
            >
              {/* Card glowing gradient aura on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon Container with gold highlights */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-primary mb-5 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300 shadow-sm">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm md:text-base mb-3 text-foreground tracking-wide group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
