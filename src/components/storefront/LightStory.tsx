import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion';

const ROOM_IMAGE = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000';

// The three layers of a lighting plan, revealed one by one as the visitor scrolls
const LAYERS = [
  {
    key: 'ambient',
    en: { title: 'Ambient light', text: 'The base layer. Soft, even light that makes a room feel open and calm: panels, linear profiles, LED strips.' },
    ar: { title: 'الإضاءة العامة', text: 'الطبقة الأساسية. ضوء ناعم ومتساوٍ يمنح المكان الاتساع والهدوء: البانل والبروفايل الخطي وشرائط LED.' },
    link: '/shop?category=led-strip-light',
    lux: 150,
  },
  {
    key: 'task',
    en: { title: 'Task light', text: 'Focused pools of light where you work, cook and read: downlights, spotlights and magnetic tracks.' },
    ar: { title: 'إضاءة المهام', text: 'بقع ضوء مركّزة حيث تعمل وتطبخ وتقرأ: الداون لايت والسبوت لايت والمسارات المغناطيسية.' },
    link: '/shop?category=led-spot-light',
    lux: 350,
  },
  {
    key: 'accent',
    en: { title: 'Accent light', text: 'The drama. Chandeliers, pendants and wall lights that give a space its character.' },
    ar: { title: 'الإضاءة الجمالية', text: 'لمسة الإبهار. الثريات والمعلّقات والإضاءة الجدارية التي تمنح المكان شخصيته.' },
    link: '/shop?category=chandelier',
    lux: 500,
  },
];

const LightStory = () => {
  const { isRTL } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [lux, setLux] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // The room brightens in steps as each layer switches on
  const brightness = useTransform(progress, [0, 0.12, 0.3, 0.55, 0.8, 1], [0.05, 0.08, 0.5, 0.75, 1.05, 1.05]);
  const saturation = useTransform(progress, [0, 0.3, 0.8], [0.2, 0.7, 1.05]);
  const roomFilter = useMotionTemplate`brightness(${brightness}) saturate(${saturation})`;
  const scale = useTransform(progress, [0, 1], [1.15, 1]);
  const taskOpacity = useTransform(progress, [0.4, 0.55], [0, 1]);
  const accentOpacity = useTransform(progress, [0.65, 0.8], [0, 1]);
  const introOpacity = useTransform(progress, [0, 0.1, 0.18], [1, 1, 0]);
  const meter = useTransform(progress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(progress, 'change', (p) => {
    const index = p < 0.18 ? -1 : p < 0.45 ? 0 : p < 0.7 ? 1 : 2;
    setActive(index);
    setLux(Math.round(Math.max(0, Math.min(1, (p - 0.12) / 0.7)) * 500));
  });

  // Without motion, show the finished, fully lit room with all three layers listed
  if (reducedMotion) {
    return (
      <section className="relative overflow-hidden bg-[#0b0907] py-20 text-white">
        <img src={ROOM_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="container relative grid gap-6 md:grid-cols-3">
          {LAYERS.map((layer, i) => (
            <Link key={layer.key} to={layer.link} className="rounded-3xl border border-white/15 bg-black/50 p-6 backdrop-blur-md">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-2 text-2xl font-extrabold">{isRTL ? layer.ar.title : layer.en.title}</h3>
              <p className="mt-2 text-sm text-white/70">{isRTL ? layer.ar.text : layer.en.text}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-[#050403]" aria-label={isRTL ? 'من الظلام إلى النور' : 'From darkness to light'}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The room */}
        <motion.img
          src={ROOM_IMAGE}
          alt={isRTL ? 'غرفة معيشة تضاء تدريجياً' : 'A living room being lit layer by layer'}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: roomFilter, scale }}
          loading="lazy"
        />
        {/* Task layer: pools of light from ceiling spots */}
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            opacity: taskOpacity,
            background:
              'radial-gradient(circle at 30% 18%, rgba(255,214,160,0.55), transparent 22%), radial-gradient(circle at 55% 15%, rgba(255,214,160,0.45), transparent 20%), radial-gradient(circle at 78% 20%, rgba(255,214,160,0.5), transparent 22%)',
          }}
        />
        {/* Accent layer: a warm glow along the ceiling line and a feature light */}
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            opacity: accentOpacity,
            background:
              'linear-gradient(180deg, rgba(255,170,90,0.35) 0%, transparent 14%), radial-gradient(ellipse at 50% 60%, rgba(255,150,70,0.25), transparent 45%)',
          }}
        />
        <div className={`pointer-events-none absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/85 via-black/35 to-transparent`} />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />

        {/* Intro line while the room is still dark */}
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div>
            <p className="eyebrow-light justify-center">{isRTL ? 'مرّر للأسفل' : 'Keep scrolling'}</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-7xl">
              {isRTL ? 'من الظلام إلى النور' : 'From darkness to light'}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/50 md:text-base">
              {isRTL ? 'شاهد كيف تبني ثلاث طبقات من الإضاءة مساحة متكاملة.' : 'Watch three layers of light build a complete space.'}
            </p>
          </div>
        </motion.div>

        {/* Layer captions */}
        <div className="container relative flex h-full items-center">
          <div className="relative h-72 w-full max-w-md">
            {LAYERS.map((layer, i) => {
              const copy = isRTL ? layer.ar : layer.en;
              return (
                <motion.div
                  key={layer.key}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : active > i ? -40 : 40,
                    filter: active === i ? 'blur(0px)' : 'blur(8px)',
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ pointerEvents: active === i ? 'auto' : 'none' }}
                >
                  <span className="font-mono text-sm text-primary">0{i + 1} / 03</span>
                  <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-6xl">{copy.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">{copy.text}</p>
                  <Link
                    to={layer.link}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {isRTL ? 'تسوق هذه الطبقة' : 'Shop this layer'}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lux meter */}
        <div className={`absolute bottom-10 hidden items-end gap-4 md:flex ${isRTL ? 'left-10' : 'right-10'}`}>
          <div className="text-end">
            <div className="font-mono text-5xl font-bold tabular-nums text-white" dir="ltr">{lux}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">{isRTL ? 'لوكس (توضيحي)' : 'Lux (illustrative)'}</div>
          </div>
          <div className="relative h-40 w-1.5 overflow-hidden rounded-full bg-white/15">
            <motion.div className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-primary to-amber-200 shadow-[0_0_14px_hsl(var(--primary))]" style={{ height: meter }} />
          </div>
        </div>

        {/* Layer steps */}
        <div className={`absolute bottom-10 flex gap-2 ${isRTL ? 'right-6 md:right-10' : 'left-6 md:left-10'}`}>
          {LAYERS.map((layer, i) => (
            <span
              key={layer.key}
              className={`h-1.5 rounded-full transition-all duration-500 ${active >= i ? 'w-10 bg-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'w-4 bg-white/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LightStory;
