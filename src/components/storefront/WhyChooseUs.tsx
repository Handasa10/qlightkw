import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Headphones, Coins, Wrench } from 'lucide-react';
import SectionHeading from '@/components/effects/SectionHeading';
import { glowHandlers } from '@/components/effects/glow';

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const features = [
    {
      key: 'premiumQuality',
      icon: <ShieldCheck className="h-7 w-7 text-primary" />,
      title: isRTL ? 'جودة فائقة ومضمونة' : 'Premium Quality',
      description: isRTL 
        ? 'منتجات إضاءة مطابقة لأعلى المعايير العالمية مع كفالة حقيقية.' 
        : 'Lighting fixtures matching top global standards, backed by premium warranties.',
    },
    {
      key: 'competitivePrices',
      icon: <Coins className="h-7 w-7 text-primary" />,
      title: isRTL ? 'أسعار تنافسية مدروسة' : 'Competitive Prices',
      description: isRTL 
        ? 'نوفر أفضل الأسعار للمشاريع وتجارة التجزئة والجملة في السوق الكويتي.' 
        : 'Unmatched wholesale and retail rates matching every project scale in Kuwait.',
    },
    {
      key: 'fastDelivery',
      icon: <Truck className="h-7 w-7 text-primary" />,
      title: isRTL ? 'توصيل سريع وآمن' : 'Fast Delivery',
      description: isRTL 
        ? 'توصيل سريع وموثوق لجميع مناطق الكويت مباشرة إلى منزلك أو موقع العمل.' 
        : 'Quick, safe and tracked logistics straight to your home or construction site.',
    },
    {
      key: 'technicalSupport',
      icon: <Headphones className="h-7 w-7 text-primary" />,
      title: isRTL ? 'دعم فني متكامل' : 'Technical Support',
      description: isRTL 
        ? 'فريق من المهندسين لمساعدتك في تخطيط وحسابات شدة الإضاءة للمساحة.' 
        : 'Dedicated engineers to assist you with lux calculations and architectural lighting planning.',
    },
    {
      key: 'installationConsultation',
      icon: <Wrench className="h-7 w-7 text-primary" />,
      title: isRTL ? 'استشارة تركيب هندسية' : 'Installation Consultation',
      description: isRTL 
        ? 'استشارات فنية مجانية حول قياسات فتحات السقف وتوزيع الأحمال والأسلاك.' 
        : 'Expert advisory on ceiling cutout sizes, beam distribution, and driver configuration.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0b0907] py-20 text-white md:py-28">
      {/* Ambient glows and a faint architectural grid */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-200/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      <div className="container relative z-10">
        <SectionHeading
          align="center"
          inverted
          className="mb-16"
          eyebrow={isRTL ? 'لماذا كواليتي لايت؟' : 'The Quality Light Difference'}
          title={isRTL ? 'لماذا يثق بنا العملاء؟' : 'Why Quality Light'}
          description={isRTL
            ? 'نحن ملتزمون بتقديم أفضل حلول الإضاءة المبتكرة لعملائنا في الكويت، من مشاريع الفلل السكنية الفخمة إلى المباني التجارية الضخمة.'
            : 'We are committed to delivering premium engineering and product excellence to both retail customers and contractors in the Kuwait market.'}
        />

        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {/* A line of light running behind the cards */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-primary to-transparent lg:block"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glow-card group flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.06]"
              {...glowHandlers}
            >
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0b0907] transition-all duration-500 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_-4px_hsl(var(--primary))]">
                {feature.icon}
              </div>
              <span className="mb-2 font-mono text-[10px] text-white/40">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mb-3 text-sm font-bold tracking-wide text-white md:text-base">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/55">
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
