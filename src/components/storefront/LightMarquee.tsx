import { useLanguage } from '@/contexts/LanguageContext';

const WORDS_EN = ['Lumen', 'Kelvin', 'Lux', 'Beam', 'Glow', 'Watt', 'CRI', 'Dimmable'];
const WORDS_AR = ['لومن', 'كلفن', 'لوكس', 'شعاع', 'توهج', 'واط', 'ثريا', 'إضاءة'];

// Two rows of oversized outlined words drifting in opposite directions; every third word is lit
// The strip holds the words twice and slides by exactly one copy (-50%), so the loop is seamless
const Row = ({ words, reverse }: { words: string[]; reverse?: boolean }) => (
  <div className="overflow-hidden whitespace-nowrap" aria-hidden="true">
    <div className={`flex w-max ${reverse ? 'animate-marquee-rtl' : 'animate-marquee'} motion-reduce:animate-none`}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {words.map((word, i) => (
            <span key={`${copy}-${word}`} className="flex items-center gap-8 pe-8 md:gap-14 md:pe-14">
              <span className={i % 3 === 1 ? 'marquee-lit' : 'marquee-outline'}>{word}</span>
              <span className="h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))] md:h-4 md:w-4" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const LightMarquee = () => {
  const { isRTL } = useLanguage();
  const words = isRTL ? WORDS_AR : WORDS_EN;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#050403] py-10 md:py-14" dir="ltr">
      <div className="space-y-2 text-[15vw] font-black uppercase leading-[0.95] tracking-tight md:text-[9vw]">
        <Row words={words} />
        <Row words={[...words].reverse()} reverse />
      </div>
      {/* Fade the edges into the background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050403] to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050403] to-transparent md:w-48" />
    </section>
  );
};

export default LightMarquee;
