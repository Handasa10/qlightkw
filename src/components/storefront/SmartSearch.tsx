import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Mic, ScanSearch } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { prepareFile } from '@/lib/quote-input';

// ---------- Voice search (browser speech recognition, Arabic or English) ----------

type Recognition = { lang: string; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

const speechApi = () => (typeof window !== 'undefined'
  ? ((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition) as (new () => Recognition) | undefined
  : undefined);

export const VoiceSearchButton = ({ onResult }: { onResult: (text: string) => void }) => {
  const { isRTL } = useLanguage();
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);
  const Api = speechApi();
  useEffect(() => () => rec.current?.stop(), []);
  if (!Api) return null;

  const toggle = () => {
    if (listening) { rec.current?.stop(); return; }
    const r = new Api();
    r.lang = isRTL ? 'ar-KW' : 'en-US';
    r.interimResults = true;
    r.onresult = (e) => {
      const text = Array.from(e.results).map((res) => res[0].transcript).join(' ');
      onResult(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); toast.error(isRTL ? 'لم نسمعك جيداً، حاول مرة أخرى' : "Couldn't hear you, please try again"); };
    rec.current = r;
    setListening(true);
    r.start();
  };

  return (
    <button type="button" onClick={toggle} aria-label={isRTL ? 'البحث بالصوت' : 'Search by voice'} className="relative flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900">
      {listening && <motion.span className="absolute inset-0 rounded-full bg-red-500/25" animate={{ scale: [1, 1.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />}
      <Mic className={`relative h-4 w-4 ${listening ? 'text-red-600' : ''}`} />
    </button>
  );
};

// ---------- Photo search: photograph a product, the AI finds it in the catalog ----------

interface Found { sku: string; slug: string; name_en: string; name_ar: string; image: string | null; price: number }

export const PhotoSearchButton = () => {
  const { isRTL } = useLanguage();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Found[] | null>(null);

  const reset = () => { setPreview(null); setResults(null); setScanning(false); };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResults(null);
    setScanning(true);
    try {
      const payload = await prepareFile(file);
      const { data, error } = await supabase.functions.invoke('smart-quote', { body: { action: 'extract', language: isRTL ? 'ar' : 'en', ...payload } });
      if (error) throw error;
      const found: Found[] = [];
      for (const line of data.lines || []) {
        for (const p of [line.match, ...(line.alternatives || [])]) if (p && !found.some((f) => f.sku === p.sku)) found.push(p);
      }
      setResults(found.slice(0, 6));
    } catch (e) {
      toast.error((e as Error).message || (isRTL ? 'تعذّر التعرف على الصورة' : 'Could not read the photo'));
      reset();
    } finally {
      setScanning(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => input.current?.click()} aria-label={isRTL ? 'البحث بالصورة' : 'Search by photo'} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900">
        <Camera className="h-4 w-4" />
      </button>
      <input ref={input} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />

      <Dialog open={!!preview} onOpenChange={(open) => !open && reset()}>
        <DialogContent className="store-light max-w-lg overflow-hidden rounded-3xl border-0 bg-white p-0 text-neutral-900 sm:rounded-3xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
            {preview && <img src={preview} alt="" className={`h-full w-full object-cover transition ${scanning ? 'opacity-70' : 'opacity-100'}`} />}
            {scanning && (
              <>
                <motion.div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary/50 to-transparent" initial={{ top: '-25%' }} animate={{ top: ['-25%', '100%'] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur"><ScanSearch className="h-4 w-4" />{isRTL ? 'نتعرّف على المنتج…' : 'Identifying the product…'}</span>
                </div>
              </>
            )}
          </div>
          <div className="p-5">
            <DialogTitle className="text-lg font-extrabold text-neutral-900">{isRTL ? 'البحث بالصورة' : 'Search by photo'}</DialogTitle>
            {results && results.length === 0 && <p className="mt-2 text-sm text-neutral-600">{isRTL ? 'لم نجد منتجاً مطابقاً. جرّب صورة أوضح أو اسألنا عبر واتساب.' : 'No matching product. Try a clearer photo or ask us on WhatsApp.'}</p>}
            {results && results.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {results.map((p, i) => (
                  <motion.div key={p.sku} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link to={`/product/${p.slug}`} onClick={reset} className="group block">
                      <div className="aspect-square overflow-hidden rounded-xl bg-[#f5f5f6] ring-primary group-hover:ring-2">{p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}</div>
                      <p className="mt-1.5 line-clamp-2 text-xs font-semibold">{isRTL ? p.name_ar : p.name_en}</p>
                      <p className="text-xs font-bold">{p.price > 0 ? `${p.price.toFixed(3)} ${isRTL ? 'د.ك' : 'KD'}` : (isRTL ? 'اطلب السعر' : 'Ask price')}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            {!scanning && <button type="button" onClick={() => input.current?.click()} className="mt-4 w-full rounded-full border border-neutral-300 py-2.5 text-sm font-semibold hover:border-neutral-900">{isRTL ? 'صورة أخرى' : 'Try another photo'}</button>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
