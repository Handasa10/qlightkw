import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, MousePointer2, Thermometer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCanHover, usePrefersReducedMotion } from '@/hooks/useReducedMotion';
import { resolveImageUrl } from '@/lib/image-resolver';
import { kelvinLabel, kelvinToRgb } from '@/lib/kelvin';
import LightParticles from '@/components/effects/LightParticles';

interface HeroSlide {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  button_text_en: string | null;
  button_text_ar: string | null;
  link_url: string | null;
  media_url: string;
  media_type: string;
  media_url_mobile: string | null;
  media_type_mobile: string | null;
  is_active: boolean;
  display_order: number;
}

const SLIDE_DURATION = 9000;
const DEFAULT_KELVIN = 3000;

// Shown when no slides are configured in the admin panel
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title_en: 'Transform Your Space with Premium Lighting',
    title_ar: 'حوّل مساحتك مع الإضاءة الفاخرة',
    subtitle_en: 'Experience premium lighting solutions tailored for modern villas, projects, and showrooms in Kuwait & GCC.',
    subtitle_ar: 'اكتشف حلول الإضاءة المتميزة المصممة خصيصاً للفيلات والمشاريع الفاخرة في الكويت والخليج.',
    button_text_en: 'Shop Now',
    button_text_ar: 'تسوق الآن',
    link_url: '/shop',
    media_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600',
    media_type: 'image',
    media_url_mobile: null,
    media_type_mobile: null,
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    title_en: 'Architectural Lighting Systems',
    title_ar: 'أنظمة الإضاءة المعمارية',
    subtitle_en: 'Elevate your interiors with modern linear profiles, magnetic tracks, and anti-glare downlights.',
    subtitle_ar: 'ارتقِ بتصاميمك الداخلية مع مقاطع البروفايل الخطي الحديثة والمسارات المغناطيسية والإضاءة المانعة للتوهج.',
    button_text_en: 'Explore Collection',
    button_text_ar: 'استكشف المجموعة',
    link_url: '/shop?category=led-spot-light',
    media_url: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=1600',
    media_type: 'image',
    media_url_mobile: null,
    media_type_mobile: null,
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    title_en: 'Luxury Decorative Chandeliers',
    title_ar: 'ثريات ديكورية فاخرة',
    subtitle_en: 'Make a design statement with premium brass, hand-blown glass, and crystal lighting pieces.',
    subtitle_ar: 'أضف لمسة جمالية فريدة مع قطع النحاس الفاخرة، الزجاج المنفوخ يدوياً، وثريات الكريستال الأنيقة.',
    button_text_en: 'Browse Chandeliers',
    button_text_ar: 'تصفح الثريات',
    link_url: '/shop?category=chandelier',
    media_url: 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=1600',
    media_type: 'image',
    media_url_mobile: null,
    media_type_mobile: null,
    is_active: true,
    display_order: 3,
  },
];

// Renders slide media; the same element is drawn twice (dark + lit) for the spotlight effect
const SlideMedia = ({ url, type, alt, className, style }: {
  url: string; type: string; alt: string; className?: string; style?: React.CSSProperties;
}) =>
  type === 'video' ? (
    <video src={url} className={className} style={style} autoPlay muted loop playsInline aria-hidden="true" />
  ) : (
    <img src={url} alt={alt} className={className} style={style} draggable={false} />
  );

const HeroSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isMobile = useIsMobile();
  const canHover = useCanHover();
  const reducedMotion = usePrefersReducedMotion();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kelvin, setKelvin] = useState(DEFAULT_KELVIN);

  const sectionRef = useRef<HTMLElement>(null);
  // Spotlight position in % of the section, smoothed towards the pointer
  const target = useRef({ x: 62, y: 42 });
  const current = useRef({ x: 62, y: 42 });
  const pointerActive = useRef(false);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      setSlides(!error && data && data.length > 0 ? data : FALLBACK_SLIDES);
      setLoading(false);
    };
    fetchSlides();
  }, []);

  const totalSlides = slides.length;

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % totalSlides), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, currentSlide]);

  // Spotlight animation loop: follows the pointer on desktop, drifts on its own on touch screens
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reducedMotion) {
      el.style.setProperty('--spot-x', '60%');
      el.style.setProperty('--spot-y', '45%');
      return;
    }

    let frame = 0;
    const loop = (time: number) => {
      if (!pointerActive.current) {
        // Slow figure-eight drift so the room "breathes" when nobody is steering
        target.current = {
          x: 58 + Math.sin(time / 3200) * 22,
          y: 45 + Math.sin(time / 2100) * 14,
        };
      }
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      el.style.setProperty('--spot-x', `${current.current.x}%`);
      el.style.setProperty('--spot-y', `${current.current.y}%`);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, loading]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerActive.current = true;
    target.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, [canHover]);

  const handlePointerLeave = useCallback(() => {
    pointerActive.current = false;
    setIsPaused(false);
  }, []);

  if (loading || slides.length === 0) {
    return <section className="relative h-[100svh] min-h-[640px] bg-[#0b0907]" aria-busy="true" />;
  }

  const slide = slides[currentSlide];
  const title = (isRTL ? slide.title_ar : slide.title_en) || '';
  const subtitle = isRTL ? slide.subtitle_ar : slide.subtitle_en;
  const buttonText = isRTL ? slide.button_text_ar : slide.button_text_en;
  const rawMediaUrl = isMobile && slide.media_url_mobile ? slide.media_url_mobile : slide.media_url;
  const mediaUrl = resolveImageUrl(rawMediaUrl, 'hero', slide.id);
  const declaredType = isMobile && slide.media_url_mobile ? (slide.media_type_mobile || 'image') : slide.media_type;
  // resolveImageUrl may swap a broken video for a photo, so trust the final URL over the declared type
  const mediaType = declaredType === 'video' && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(mediaUrl) ? 'video' : 'image';

  const [r, g, b] = kelvinToRgb(kelvin);
  const lightRgb = `${r}, ${g}, ${b}`;
  const words = title.split(/\s+/).filter(Boolean);
  const kelvinPercent = ((kelvin - 2700) / (6500 - 2700)) * 100;

  return (
    <section
      ref={sectionRef}
      className="hero-stage relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0b0907] text-white select-none"
      style={{ '--light-rgb': lightRgb } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={handlePointerLeave}
    >
      {/* Room, unlit */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`dark-${slide.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SlideMedia
            url={mediaUrl}
            type={mediaType}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(0.22) saturate(0.5) contrast(1.1)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Room, lit: revealed through the moving spotlight and tinted by the chosen color temperature */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`lit-${slide.id}`}
          className="hero-lit absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SlideMedia
            url={mediaUrl}
            type={mediaType}
            alt={title || `Slide ${currentSlide + 1}`}
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(1.08) contrast(1.05)' }}
          />
          <div className="absolute inset-0 mix-blend-soft-light transition-colors duration-500" style={{ backgroundColor: `rgba(${lightRgb}, 0.55)` }} />
        </motion.div>
      </AnimatePresence>

      {/* Soft glow at the spotlight centre */}
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Pendant beam from the ceiling */}
      <div className="hero-beam pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true" />

      {!reducedMotion && (
        <LightParticles color={lightRgb} density={70} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />
      )}

      {/* Readability gradients and film grain */}
      <div className={`pointer-events-none absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/80 via-black/40 to-transparent`} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container">
          <div className={`max-w-3xl ${isRTL ? 'text-right' : 'text-left'}`}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: `rgb(${lightRgb})` }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: `rgb(${lightRgb})` }} />
              </span>
              {isRTL ? 'كواليتي لايت · الكويت' : 'Quality Light · Kuwait'}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${slide.id}-${i18n.language}`}
                className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)', transition: { duration: 0.35 } }}
              >
                {words.map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block whitespace-pre"
                    initial={{ opacity: 0, y: '0.6em', filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* The last word carries the light */}
                    {i === words.length - 1 ? (
                      <span
                        className="hero-shine bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(110deg, #fff 20%, rgb(${lightRgb}) 40%, hsl(var(--primary)) 55%, #fff 80%)` }}
                      >
                        {word}
                      </span>
                    ) : word}
                    {i < words.length - 1 ? ' ' : ''}
                  </motion.span>
                ))}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {subtitle && (
                <motion.p
                  key={`sub-${slide.id}-${i18n.language}`}
                  className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.45 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Link
                to={slide.link_url || '/shop'}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_0_40px_-8px_hsl(var(--primary))] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{buttonText || (isRTL ? 'تسوق الآن' : 'Shop Now')}</span>
                <ArrowRight className={`relative h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10"
              >
                {isRTL ? 'تصفح الأقسام' : 'Browse Categories'}
              </a>
            </motion.div>

            {/* Color temperature control: re-tints the whole scene */}
            <motion.div
              className="mt-10 w-full max-w-sm rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              onPointerDown={e => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-white/60">
                  <Thermometer className="h-3.5 w-3.5" />
                  {isRTL ? 'درجة حرارة اللون' : 'Color Temperature'}
                </span>
                <span className="font-mono font-bold tabular-nums" style={{ color: `rgb(${lightRgb})` }}>
                  {kelvin}K · {kelvinLabel(kelvin, isRTL)}
                </span>
              </div>
              <input
                type="range"
                min={2700}
                max={6500}
                step={100}
                value={kelvin}
                onChange={e => setKelvin(Number(e.target.value))}
                aria-label={isRTL ? 'درجة حرارة اللون بالكلفن' : 'Color temperature in Kelvin'}
                className="kelvin-slider w-full"
                style={{ '--kelvin-pos': `${kelvinPercent}%` } as React.CSSProperties}
                dir="ltr"
              />
              {canHover && !reducedMotion && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/45">
                  <MousePointer2 className="h-3 w-3" />
                  {isRTL ? 'حرّك المؤشر لإضاءة الغرفة' : 'Move your cursor to light the room'}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide index */}
      {totalSlides > 1 && (
        <div className={`absolute bottom-10 z-10 hidden items-end gap-5 md:flex ${isRTL ? 'left-10' : 'right-10'}`}>
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className="group flex flex-col items-start gap-2 text-left"
              aria-label={`${isRTL ? 'الشريحة' : 'Slide'} ${index + 1}`}
              aria-current={index === currentSlide}
            >
              <span className={`font-mono text-xs transition-colors ${index === currentSlide ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="relative block h-[2px] w-16 overflow-hidden rounded-full bg-white/20">
                {index === currentSlide && (
                  <motion.span
                    key={`${currentSlide}-${isPaused}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: isPaused ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: isPaused ? 0 : SLIDE_DURATION / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile slide dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:hidden">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${index === currentSlide ? 'w-7 bg-white' : 'w-1.5 bg-white/40'}`}
              aria-label={`${isRTL ? 'الشريحة' : 'Slide'} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll cue */}
      <a
        href="#categories"
        className={`absolute bottom-10 z-10 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white md:flex ${isRTL ? 'right-10' : 'left-10'}`}
        aria-label={isRTL ? 'انتقل للأسفل' : 'Scroll down'}
      >
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;
