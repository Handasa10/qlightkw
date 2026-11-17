import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const STUDIO = 'https://yubebbfsmlopmnluajgf.supabase.co/storage/v1/object/public/product-images/studio';
const LOOKS = ['switch-3-white', 'switch-4-gold', 'socket-13a-double-chrome', 'dimmer-3-white', 'switch-6-white', 'socket-13a-single-black'];

// Home banner for the switch & socket designer: the preview cycles through finishes
const ConfiguratorBanner = () => {
  const { isRTL } = useLanguage();
  const [i, setI] = useState(0);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % LOOKS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container py-8">
      <Link to="/configure" className="group grid items-center overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 md:grid-cols-[1.2fr_1fr]">
        <div className="p-7 md:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm"><Wand2 className="h-3.5 w-3.5" />{isRTL ? 'جديد' : 'New'}</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">{isRTL ? 'صمّم مفتاحك أو فيشك في ثوانٍ' : 'Design your switch or socket in seconds'}</h2>
          <p className="mt-3 max-w-md text-sm text-neutral-600 md:text-base">{isRTL ? 'اختر النوع وعدد الأزرار واللون، وشاهد النتيجة فوراً مع السعر.' : 'Pick the type, number of buttons and finish, and see it instantly with the price.'}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition group-hover:bg-primary">{isRTL ? 'ابدأ التصميم' : 'Start designing'}<Arrow className="h-4 w-4" /></span>
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.img key={LOOKS[i]} src={`${STUDIO}/${LOOKS[i]}.jpg`} alt="" className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.45 }} />
          </AnimatePresence>
        </div>
      </Link>
    </section>
  );
};

export default ConfiguratorBanner;
