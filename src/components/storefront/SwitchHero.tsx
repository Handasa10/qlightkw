import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Hand } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ROOM = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000';

// A short, soft "click" made in the browser (no audio file)
function clickSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    src.buffer = buffer;
    src.connect(gain).connect(ctx.destination);
    src.start();
    setTimeout(() => ctx.close(), 200);
  } catch { /* audio unavailable */ }
}

// The home page opens in a dark room; the visitor flips a real-looking switch and the lights come on
const SwitchHero = () => {
  const { isRTL } = useLanguage();
  const [on, setOn] = useState(false);
  const touched = useRef(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  // If nobody flips it, the lights come on by themselves so the page never stays dark
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setOn(true); return; }
    const t = setTimeout(() => { if (!touched.current) setOn(true); }, 6500);
    return () => clearTimeout(t);
  }, []);

  const flip = () => {
    touched.current = true;
    clickSound();
    setOn((v) => !v);
  };

  return (
    <section className="container pt-4 md:pt-6">
      <div className="relative h-[540px] overflow-hidden rounded-3xl bg-black md:h-[600px]">
        <motion.img
          src={ROOM}
          alt={isRTL ? 'غرفة معيشة مضاءة' : 'A lit living room'}
          className="absolute inset-0 h-full w-full object-cover"
          initial={false}
          animate={{ filter: on ? 'brightness(1) saturate(1.05)' : 'brightness(0.12) saturate(0.4)', scale: on ? 1 : 1.06 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Warm light spilling from the ceiling when the lights are on */}
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 1.4, delay: on ? 0.15 : 0 }}
          style={{ background: 'radial-gradient(circle at 30% 8%, rgba(255,205,140,0.45), transparent 30%), radial-gradient(circle at 70% 10%, rgba(255,205,140,0.35), transparent 28%)' }} />
        <div className={`pointer-events-none absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/75 via-black/30 to-transparent`} />

        <div className="relative flex h-full flex-col justify-end p-7 md:justify-center md:p-14">
          <AnimatePresence mode="wait">
            {on ? (
              <motion.div key="on" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, delay: 0.35 }} className="max-w-xl text-white">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{isRTL ? 'كواليتي لايت · الكويت' : 'Quality Light · Kuwait'}</span>
                <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">{isRTL ? 'كل ما يضيء بيتك، في مكان واحد' : 'Everything that lights your home, in one place'}</h1>
                <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">{isRTL ? 'إضاءة، مفاتيح وأفياش، وكل لوازم التمديدات. توصيل لجميع مناطق الكويت والدفع عند الاستلام.' : 'Lighting, switches and sockets, and every wiring essential. Delivery across Kuwait, cash on delivery.'}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/shop?dept=indoor-lighting" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition hover:bg-primary hover:text-white">{isRTL ? 'تسوق الإضاءة' : 'Shop lighting'}<Arrow className="h-4 w-4" /></Link>
                  <Link to="/configure" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">{isRTL ? 'صمّم مفتاحك' : 'Design your switch'}</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md text-white">
                <p className="text-3xl font-extrabold leading-tight md:text-5xl">{isRTL ? 'الغرفة مظلمة…' : 'It’s dark in here…'}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/70 md:text-base"><Hand className="h-4 w-4" />{isRTL ? 'اضغط المفتاح لتشغيل الإضاءة' : 'Flip the switch to turn the lights on'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The switch */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-6 md:left-16' : 'right-6 md:right-16'}`}>
          <button type="button" onClick={flip} aria-pressed={on} aria-label={on ? (isRTL ? 'إطفاء الإضاءة' : 'Turn the lights off') : (isRTL ? 'تشغيل الإضاءة' : 'Turn the lights on')}
            className="group relative flex h-36 w-28 items-center justify-center rounded-[18px] bg-gradient-to-b from-neutral-50 to-neutral-200 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_white] md:h-44 md:w-32">
            {!on && <motion.span className="absolute -inset-3 rounded-[24px] border-2 border-amber-300/60" animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />}
            <span className="relative h-24 w-14 rounded-xl bg-neutral-300/70 p-1.5 shadow-inner md:h-28 md:w-16" style={{ perspective: 300 }}>
              <motion.span className="absolute inset-1.5 rounded-lg bg-gradient-to-b from-white to-neutral-100 shadow-md" initial={false}
                animate={{ rotateX: on ? -14 : 14 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }} style={{ transformOrigin: 'center' }}>
                <span className={`absolute left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-full transition-colors ${on ? 'top-2.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]' : 'bottom-2.5 bg-neutral-300'}`} />
              </motion.span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SwitchHero;
