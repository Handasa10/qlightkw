import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ROOM = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=70&w=1200';

const TEMPS = [
  { k: 3000, en: 'Warm', ar: 'دافئ', tint: 'rgba(255,170,80,0.32)', filter: 'sepia(0.35) saturate(1.15) brightness(1.02)', hint: { en: 'Cosy: bedrooms, living rooms, majlis', ar: 'مريح: غرف النوم والمعيشة والمجالس' } },
  { k: 4000, en: 'Natural', ar: 'طبيعي', tint: 'rgba(255,240,220,0.12)', filter: 'saturate(1) brightness(1.05)', hint: { en: 'Balanced: kitchens, offices, bathrooms', ar: 'متوازن: المطابخ والمكاتب والحمامات' } },
  { k: 6500, en: 'Cool', ar: 'أبيض بارد', tint: 'rgba(170,205,255,0.28)', filter: 'saturate(0.85) brightness(1.08) hue-rotate(-8deg)', hint: { en: 'Bright: garages, warehouses, workshops', ar: 'ساطع: الكراجات والمخازن والورش' } },
];

// Shows the same room in warm, natural and cool white, so customers pick the right colour temperature
const LightSimulator = ({ initial }: { initial?: number }) => {
  const { isRTL } = useLanguage();
  const start = TEMPS.findIndex((t) => initial && Math.abs(t.k - initial) < 600);
  const [i, setI] = useState(start >= 0 ? start : 0);
  const t = TEMPS[i];
  return (
    <div className="rounded-3xl border border-neutral-200 p-5">
      <p className="flex items-center gap-2 text-sm font-extrabold"><Sun className="h-4 w-4 text-primary" />{isRTL ? 'جرّب لون الإضاءة في غرفتك' : 'Try the light colour in a room'}</p>
      <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-2xl">
        <motion.img src={ROOM} alt="" className="absolute inset-0 h-full w-full object-cover" animate={{ filter: t.filter }} transition={{ duration: 0.6 }} />
        <motion.div className="absolute inset-0 mix-blend-soft-light" animate={{ backgroundColor: t.tint }} transition={{ duration: 0.6 }} />
        <span className="absolute bottom-3 start-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur" dir="ltr">{t.k}K</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TEMPS.map((x, n) => (
          <button key={x.k} type="button" onClick={() => setI(n)} className={`rounded-xl border-2 px-2 py-2 text-xs font-bold transition ${n === i ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'}`}>
            <span className="mx-auto mb-1 block h-3 w-8 rounded-full" style={{ background: n === 0 ? '#ffc37a' : n === 1 ? '#fff4e0' : '#cfe1ff' }} />
            {isRTL ? x.ar : x.en} <span className="font-normal text-neutral-500" dir="ltr">{x.k}K</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-500">{isRTL ? t.hint.ar : t.hint.en}</p>
    </div>
  );
};

export default LightSimulator;
