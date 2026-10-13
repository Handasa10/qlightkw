import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, FileSpreadsheet, Loader2, Plus, Search, Sparkles, Trash2, Upload } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/image-resolver';
import { prepareFile, type QuoteSource } from '@/lib/quote-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

export interface QuoteProduct {
  sku: string;
  slug: string;
  name_en: string;
  name_ar: string;
  image: string | null;
  price: number;
}

interface Line {
  key: string;
  requested: string;
  quantity: number;
  unit: string;
  match: QuoteProduct | null;
  alternatives: QuoteProduct[];
}

const newKey = () => Math.random().toString(36).slice(2);

const fmt = (n: number) => n.toFixed(3);

// Search the catalog to fix or add a line
function ProductPicker({ isRTL, onPick, children }: { isRTL: boolean; onPick: (p: QuoteProduct) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<QuoteProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = q.replace(/[,()%*]/g, ' ').trim();
    if (term.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('sku, slug, name_en, name_ar, base_price, sale_price, product_images(url, is_primary)')
        .eq('is_active', true)
        .or(`name_en.ilike.%${term}%,name_ar.ilike.%${term}%,sku.ilike.%${term}%`)
        .limit(10);
      setResults((data || []).map((r) => {
        const imgs = (r.product_images as { url: string; is_primary: boolean }[] | null) || [];
        return {
          sku: r.sku as string, slug: r.slug, name_en: r.name_en, name_ar: r.name_ar,
          image: (imgs.find((i) => i.is_primary) || imgs[0])?.url || null,
          price: Number(r.sale_price) > 0 ? Number(r.sale_price) : Number(r.base_price) || 0,
        };
      }));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <div className="relative">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} className="ps-8" placeholder={isRTL ? 'ابحث عن منتج أو رمز' : 'Search product or code'} />
        </div>
        <div className="mt-2 max-h-72 overflow-y-auto">
          {loading && <Loader2 className="mx-auto my-3 h-4 w-4 animate-spin" />}
          {!loading && q.length >= 2 && results.length === 0 && (
            <p className="p-3 text-center text-xs text-muted-foreground">{isRTL ? 'لا توجد نتائج' : 'No results'}</p>
          )}
          {results.map((p) => (
            <button key={p.sku} type="button" onClick={() => { onPick(p); setOpen(false); setQ(''); }}
              className="flex w-full items-center gap-2 rounded-md p-2 text-start text-sm hover:bg-muted">
              <span className="min-w-0 flex-1 truncate">{isRTL ? p.name_ar : p.name_en}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{p.price > 0 ? fmt(p.price) : '—'}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Quote() {
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  useSEO({
    title: isRTL ? 'عرض سعر فوري | ارفع قائمتك أو صوّرها' : 'Instant Quotation | Upload or Photograph Your List',
    description: isRTL
      ? 'ارفع ملف إكسل أو صورة لطلبك المكتوب بخط اليد واحصل على عرض سعر رسمي من كواليتي لايت خلال دقيقة.'
      : 'Upload an Excel sheet or a photo of your handwritten list and get an official quotation from Quality Light in about a minute.',
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [typed, setTyped] = useState('');
  const [reading, setReading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [source, setSource] = useState<QuoteSource | 'product'>('text');
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', company: '' });
  const [creating, setCreating] = useState(false);

  // "Request a quote" from a product page starts with that product
  useEffect(() => {
    const sku = params.get('sku');
    if (!sku) return;
    (async () => {
      const { data } = await supabase.from('products')
        .select('sku, slug, name_en, name_ar, base_price, sale_price, product_images(url, is_primary)')
        .eq('sku', sku).eq('is_active', true).maybeSingle();
      if (!data) return;
      const imgs = (data.product_images as { url: string; is_primary: boolean }[] | null) || [];
      const p: QuoteProduct = {
        sku: data.sku as string, slug: data.slug, name_en: data.name_en, name_ar: data.name_ar,
        image: (imgs.find((i) => i.is_primary) || imgs[0])?.url || null,
        price: Number(data.sale_price) > 0 ? Number(data.sale_price) : Number(data.base_price) || 0,
      };
      setLines([{ key: newKey(), requested: p.name_en, quantity: Number(params.get('qty')) || 1, unit: '', match: p, alternatives: [] }]);
      setSource('product');
      setStep('review');
    })();
  }, [params]);

  const read = async (payload: { source: QuoteSource; text?: string; file?: { data: string; mimeType: string } }) => {
    setReading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-quote', { body: { action: 'extract', language, ...payload } });
      if (error) throw error;
      const found: Line[] = (data.lines || []).map((l: Omit<Line, 'key'>) => ({ ...l, key: newKey() }));
      if (!found.length) {
        toast.error(isRTL ? 'لم نجد منتجات في الطلب. جرّب صورة أوضح أو اكتب القائمة.' : 'We could not find products in it. Try a clearer photo or type the list.');
        return;
      }
      setLines(found);
      setSource(data.source || payload.source);
      setAttachmentId(data.attachmentId || null);
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setReading(false);
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    try {
      await read(await prepareFile(file));
    } catch (e) {
      const code = (e as Error).message;
      toast.error(code === 'too-large'
        ? (isRTL ? 'الملف كبير جداً (الحد 8 ميجابايت)' : 'The file is too large (max 8 MB)')
        : code === 'unsupported'
          ? (isRTL ? 'ارفع ملف إكسل أو صورة أو PDF' : 'Please upload an Excel sheet, a photo or a PDF')
          : (isRTL ? 'تعذّرت قراءة الملف' : 'We could not open that file'));
      setReading(false);
    }
  };

  const update = (key: string, changes: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...changes } : l)));
  const remove = (key: string) => setLines((ls) => ls.filter((l) => l.key !== key));

  const priced = lines.filter((l) => l.match && l.match.price > 0);
  const subtotal = priced.reduce((s, l) => s + l.match!.price * l.quantity, 0);
  const toConfirm = lines.length - priced.length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lines.length) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-quote', {
        body: {
          action: 'create', language, source, attachmentId, customer,
          lines: lines.map((l) => ({ requested: l.requested, quantity: l.quantity, unit: l.unit, sku: l.match?.sku || null })),
        },
      });
      if (error) throw error;
      navigate(`/quote/${data.id}?t=${data.token}`);
    } catch (e) {
      toast.error((e as Error).message);
      setCreating(false);
    }
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-border/40 bg-muted/10 py-10 md:py-14">
        <div className="container max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {isRTL ? 'عرض سعر فوري' : 'Instant quotation'}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            {isRTL ? 'أرسل قائمتك، نجهّز لك عرض السعر' : 'Send your list, get an official offer'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {isRTL
              ? 'ارفع ملف إكسل، أو صوّر طلبك المكتوب على ورقة، أو اكتب القائمة. نقرأها ونطابقها مع منتجاتنا ونصدر لك عرض سعر رسمي برقم مرجعي.'
              : 'Upload an Excel sheet, photograph a handwritten list, or type it. We read it, match it to our products and issue an official quotation with a reference number.'}
          </p>
        </div>
      </section>

      <div className="container max-w-5xl py-10">
        {step === 'input' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <button type="button" disabled={reading} onClick={() => fileRef.current?.click()}
                className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary disabled:opacity-60">
                <span className="flex gap-2 text-primary"><FileSpreadsheet className="h-8 w-8" /><Upload className="h-8 w-8" /></span>
                <span className="text-lg font-bold">{isRTL ? 'ارفع ملف' : 'Upload a file'}</span>
                <span className="text-sm text-muted-foreground">{isRTL ? 'إكسل، CSV، PDF أو صورة (حتى 8 ميجابايت)' : 'Excel, CSV, PDF or a photo (up to 8 MB)'}</span>
              </button>
              <button type="button" disabled={reading} onClick={() => cameraRef.current?.click()}
                className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary disabled:opacity-60">
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-lg font-bold">{isRTL ? 'صوّر الطلب' : 'Take a photo'}</span>
                <span className="text-sm text-muted-foreground">{isRTL ? 'ورقة مكتوبة بخط اليد أو قائمة مطبوعة' : 'A handwritten note or a printed list'}</span>
              </button>
              <input ref={fileRef} type="file" hidden accept=".xlsx,.xls,.csv,.pdf,image/*" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
              <input ref={cameraRef} type="file" hidden accept="image/*" capture="environment" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
            </div>

            <div className="rounded-3xl border bg-card p-6">
              <Label htmlFor="typed" className="text-base font-bold">{isRTL ? 'أو اكتب القائمة' : 'Or type your list'}</Label>
              <Textarea id="typed" value={typed} onChange={(e) => setTyped(e.target.value)} rows={6} className="mt-3"
                placeholder={isRTL ? 'مثال:\n20 بلاك 13 امبير دبل\n10 سوتش 2 كبسه\n100 متر واير 2.5 ملي' : 'Example:\n20 double 13A sockets\n10 two-gang switches\n100 m of 2.5mm wire'} />
              <Button className="mt-4" disabled={reading || typed.trim().length < 2} onClick={() => { setFileName(''); read({ source: 'text', text: typed }); }}>
                <Sparkles className="me-2 h-4 w-4" /> {isRTL ? 'جهّز عرض السعر' : 'Prepare my quotation'}
              </Button>
            </div>

            {reading && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border bg-muted/30 p-6 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                {isRTL ? `نقرأ ${fileName || 'طلبك'} ونطابقه مع منتجاتنا...` : `Reading ${fileName || 'your request'} and matching it to our products...`}
              </div>
            )}
          </div>
        )}

        {step === 'review' && (
          <form onSubmit={submit} className="space-y-8">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{isRTL ? 'راجع القائمة' : 'Check your list'}</h2>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'عدّل الكميات أو غيّر المنتج إن لزم. البنود غير المطابقة نؤكد سعرها معك.' : 'Adjust quantities or change a product if needed. Anything we could not match, we confirm with you.'}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => { setStep('input'); setLines([]); setAttachmentId(null); }}>
                  {isRTL ? 'ابدأ من جديد' : 'Start over'}
                </Button>
              </div>

              <div className="mt-4 divide-y rounded-2xl border bg-card">
                {lines.map((l, i) => (
                  <div key={l.key} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                    <span className="hidden w-6 shrink-0 font-mono text-xs text-muted-foreground md:block">{i + 1}</span>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {l.match?.image && <img src={resolveImageUrl(l.match.image, 'product', l.match.slug)} alt="" className="h-full w-full object-cover" loading="lazy" />}
                      </div>
                      <div className="min-w-0">
                        {l.match ? (
                          <p className="truncate font-semibold">{isRTL ? l.match.name_ar : l.match.name_en}</p>
                        ) : (
                          <p className="font-semibold text-amber-600">{isRTL ? 'لم نجد مطابقة، سنؤكد معك' : 'No match yet, we will confirm'}</p>
                        )}
                        {l.requested && <p className="truncate text-xs text-muted-foreground">{isRTL ? 'طلبك: ' : 'You asked: '}{l.requested}</p>}
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {l.alternatives.map((alt) => (
                            <button key={alt.sku} type="button" onClick={() => update(l.key, { match: alt, alternatives: [l.match, ...l.alternatives.filter((a) => a.sku !== alt.sku)].filter(Boolean) as QuoteProduct[] })}
                              className="rounded-full border px-2 py-0.5 text-[11px] hover:border-primary hover:text-primary">
                              {isRTL ? alt.name_ar : alt.name_en}
                            </button>
                          ))}
                          <ProductPicker isRTL={isRTL} onPick={(p) => update(l.key, { match: p })}>
                            <button type="button" className="rounded-full border border-dashed px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary">
                              <Search className="me-1 inline h-3 w-3" />{isRTL ? 'منتج آخر' : 'Other product'}
                            </button>
                          </ProductPicker>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:w-72 md:justify-end">
                      <Input type="number" min={1} value={l.quantity} aria-label={isRTL ? 'الكمية' : 'Quantity'}
                        onChange={(e) => update(l.key, { quantity: Math.max(1, Math.round(Number(e.target.value) || 1)) })} className="w-24" />
                      <span className="w-28 text-end font-mono text-sm">
                        {l.match && l.match.price > 0 ? `${fmt(l.match.price * l.quantity)} KWD` : <span className="text-emerald-600">{isRTL ? 'يُؤكد' : 'To confirm'}</span>}
                      </span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(l.key)} aria-label={isRTL ? 'حذف' : 'Remove'}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <ProductPicker isRTL={isRTL} onPick={(p) => setLines((ls) => [...ls, { key: newKey(), requested: '', quantity: 1, unit: '', match: p, alternatives: [] }])}>
                    <Button type="button" variant="outline" size="sm"><Plus className="me-1 h-4 w-4" />{isRTL ? 'أضف منتجاً' : 'Add a product'}</Button>
                  </ProductPicker>
                  <div className="text-end">
                    <p className="text-lg font-extrabold">{isRTL ? 'المجموع: ' : 'Subtotal: '}<span className="font-mono">{fmt(subtotal)} KWD</span></p>
                    {toConfirm > 0 && <p className="text-xs text-muted-foreground">{isRTL ? `+ ${toConfirm} بند يُؤكد سعره عبر واتساب` : `+ ${toConfirm} item(s) priced on confirmation`}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-6">
              <h2 className="text-xl font-bold">{isRTL ? 'بياناتك لعرض السعر' : 'Your details for the quotation'}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div><Label htmlFor="q-name">{isRTL ? 'الاسم *' : 'Name *'}</Label>
                  <Input id="q-name" required minLength={2} maxLength={100} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></div>
                <div><Label htmlFor="q-phone">{isRTL ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}</Label>
                  <Input id="q-phone" required type="tel" dir="ltr" pattern="\+?[0-9 ]{7,16}" maxLength={16} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></div>
                <div><Label htmlFor="q-company">{isRTL ? 'الشركة (اختياري)' : 'Company (optional)'}</Label>
                  <Input id="q-company" maxLength={120} value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} /></div>
                <div><Label htmlFor="q-email">{isRTL ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}</Label>
                  <Input id="q-email" type="email" dir="ltr" maxLength={255} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} /></div>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full md:w-auto" disabled={creating || !lines.length}>
                {creating ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Sparkles className="me-2 h-4 w-4" />}
                {isRTL ? 'أصدر عرض السعر الرسمي' : 'Generate my official quotation'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </StorefrontLayout>
  );
}
