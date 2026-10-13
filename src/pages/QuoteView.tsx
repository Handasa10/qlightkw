import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, Printer, ShoppingCart } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuoteItem {
  line: number;
  requested: string;
  quantity: number;
  unit: string;
  sku: string | null;
  product_id: string | null;
  slug: string | null;
  name_en: string | null;
  name_ar: string | null;
  unit_price: number | null;
  total: number | null;
  on_request: boolean;
}

interface QuoteDoc {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  company: string | null;
  items: QuoteItem[];
  subtotal: number;
  on_request_count: number;
  valid_until: string;
  created_at: string;
}

const WHATSAPP = '96551111725';
const fmt = (n: number) => Number(n).toFixed(3);

// The official quotation: printable / savable as PDF, shareable with the shop on WhatsApp
export default function QuoteView() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get('t') || '';
  const { isRTL } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  useSEO({ title: isRTL ? 'عرض السعر' : 'Your quotation', description: '', noindex: true });

  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', id, token],
    enabled: Boolean(id && token),
    queryFn: async (): Promise<QuoteDoc | null> => {
      const { data, error } = await supabase.rpc('get_quote' as never, { _id: id, _token: token } as never);
      if (error) throw error;
      return (data as unknown as QuoteDoc) || null;
    },
  });

  const date = (iso: string) => new Date(iso).toLocaleDateString(isRTL ? 'ar-KW' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const whatsapp = () => {
    if (!quote) return;
    const text = isRTL
      ? `مرحباً، أود تأكيد عرض السعر ${quote.quote_number} (${quote.items.length} بند).\n${window.location.href}`
      : `Hello, I'd like to confirm quotation ${quote.quote_number} (${quote.items.length} items).\n${window.location.href}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const addAll = async () => {
    if (!quote) return;
    setAdding(true);
    try {
      for (const item of quote.items.filter((i) => i.product_id && !i.on_request)) {
        await addItem(item.product_id!, item.quantity);
      }
      navigate('/cart');
    } catch {
      toast.error(isRTL ? 'تعذّرت الإضافة إلى السلة' : 'Could not add to cart');
      setAdding(false);
    }
  };

  if (isLoading) {
    return <StorefrontLayout><div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></StorefrontLayout>;
  }

  if (!quote) {
    return (
      <StorefrontLayout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">{isRTL ? 'لم نجد عرض السعر' : 'Quotation not found'}</h1>
          <p className="mt-2 text-muted-foreground">{isRTL ? 'تأكد من الرابط أو اطلب عرضاً جديداً.' : 'Check the link or request a new quotation.'}</p>
          <Button asChild className="mt-6"><Link to="/quote">{isRTL ? 'عرض سعر جديد' : 'New quotation'}</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  const pricedCount = quote.items.filter((i) => !i.on_request).length;

  return (
    <StorefrontLayout>
      {/* Print only the document */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        #quote-doc, #quote-doc * { visibility: visible !important; }
        #quote-doc { position: absolute; inset: 0 auto auto 0; width: 100%; margin: 0; box-shadow: none !important; border: 0 !important; }
        @page { size: A4; margin: 12mm; }
      }`}</style>

      <div className="container max-w-4xl py-8">
        <div className="mb-6 flex flex-wrap gap-3 print:hidden">
          <Button onClick={() => window.print()}><Printer className="me-2 h-4 w-4" />{isRTL ? 'طباعة / حفظ PDF' : 'Print / Save as PDF'}</Button>
          <Button variant="outline" onClick={whatsapp} className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
            <MessageCircle className="me-2 h-4 w-4" />{isRTL ? 'أرسله لنا على واتساب' : 'Send to us on WhatsApp'}
          </Button>
          {pricedCount > 0 && (
            <Button variant="outline" onClick={addAll} disabled={adding}>
              {adding ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="me-2 h-4 w-4" />}
              {isRTL ? 'أضف البنود المسعّرة للسلة' : 'Add priced items to cart'}
            </Button>
          )}
        </div>

        <article id="quote-doc" dir={isRTL ? 'rtl' : 'ltr'} className="rounded-2xl border bg-white p-6 text-slate-900 shadow-sm md:p-10">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-amber-500 pb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Quality Light" className="h-16 w-auto" />
              <div className="text-xs leading-relaxed text-slate-600">
                <p className="text-base font-extrabold text-slate-900">{isRTL ? 'كواليتي لايت' : 'Quality Light'}</p>
                <p>{isRTL ? 'حولي - شارع تونس، الكويت' : 'Tunis Street, Hawalli, Kuwait'}</p>
                <p dir="ltr" className={isRTL ? 'text-end' : ''}>+965 5111 1725 · info@qlightkw.com · qlightkw.com</p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-2xl font-extrabold tracking-tight text-amber-600">{isRTL ? 'عرض سعر' : 'QUOTATION'}</p>
              <p className="mt-1 font-mono text-sm font-bold">{quote.quote_number}</p>
              <p className="text-xs text-slate-500">{isRTL ? 'التاريخ: ' : 'Date: '}{date(quote.created_at)}</p>
              <p className="text-xs text-slate-500">{isRTL ? 'صالح حتى: ' : 'Valid until: '}{date(quote.valid_until)}</p>
            </div>
          </header>

          <section className="mt-6 grid gap-1 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{isRTL ? 'مقدم إلى' : 'Prepared for'}</p>
            <p className="font-bold">{quote.customer_name}{quote.company ? ` · ${quote.company}` : ''}</p>
            <p className="text-slate-600" dir="ltr">{quote.customer_phone}{quote.customer_email ? ` · ${quote.customer_email}` : ''}</p>
          </section>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2 text-start font-semibold">#</th>
                  <th className="p-2 text-start font-semibold">{isRTL ? 'البند' : 'Item'}</th>
                  <th className="p-2 text-start font-semibold">{isRTL ? 'الرمز' : 'Code'}</th>
                  <th className="p-2 text-end font-semibold">{isRTL ? 'الكمية' : 'Qty'}</th>
                  <th className="p-2 text-end font-semibold">{isRTL ? 'سعر الوحدة' : 'Unit price'}</th>
                  <th className="p-2 text-end font-semibold">{isRTL ? 'المجموع' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.line} className="border-b border-slate-200 align-top even:bg-slate-50">
                    <td className="p-2 font-mono text-xs text-slate-500">{item.line}</td>
                    <td className="p-2">
                      <p className="font-semibold">{(isRTL ? item.name_ar : item.name_en) || item.requested}</p>
                      {item.sku && item.requested && <p className="text-[11px] text-slate-500">{isRTL ? 'طلبك: ' : 'Requested: '}{item.requested}</p>}
                      {!item.sku && <p className="text-[11px] text-amber-700">{isRTL ? 'سيتم تحديد المنتج المناسب وتأكيده معك' : 'We will select the right product and confirm it with you'}</p>}
                    </td>
                    <td className="p-2 font-mono text-xs">{item.sku || '—'}</td>
                    <td className="p-2 text-end font-mono">{item.quantity}{item.unit ? ` ${item.unit}` : ''}</td>
                    <td className="p-2 text-end font-mono">{item.on_request ? (isRTL ? 'يُؤكد' : 'TBC') : fmt(item.unit_price!)}</td>
                    <td className="p-2 text-end font-mono">{item.on_request ? (isRTL ? 'يُؤكد' : 'TBC') : fmt(item.total!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-extrabold">
                <span>{isRTL ? 'المجموع (د.ك)' : 'Total (KWD)'}</span>
                <span className="font-mono">{fmt(quote.subtotal)}</span>
              </div>
              {quote.on_request_count > 0 && (
                <p className="text-xs text-slate-500">
                  {isRTL ? `لا يشمل ${quote.on_request_count} بند يُؤكد سعره (TBC)` : `Excludes ${quote.on_request_count} item(s) to be confirmed (TBC)`}
                </p>
              )}
            </div>
          </section>

          <footer className="mt-8 border-t border-slate-200 pt-4 text-[11px] leading-relaxed text-slate-500">
            <p className="font-bold text-slate-700">{isRTL ? 'الشروط' : 'Terms'}</p>
            <ul className="mt-1 list-disc space-y-0.5 ps-4">
              <li>{isRTL ? 'الأسعار بالدينار الكويتي.' : 'Prices are in Kuwaiti Dinars (KWD).'}</li>
              <li>{isRTL ? `العرض صالح حتى ${date(quote.valid_until)} وحسب توفر المخزون.` : `Valid until ${date(quote.valid_until)}, subject to stock availability.`}</li>
              <li>{isRTL ? 'البنود المعلّمة "يُؤكد" يحدد فريقنا سعرها ويؤكدها معك عبر واتساب أو الهاتف.' : 'Items marked TBC are priced and confirmed by our team on WhatsApp or by phone.'}</li>
              <li>{isRTL ? 'التوصيل متاح لجميع مناطق الكويت.' : 'Delivery available across Kuwait.'}</li>
            </ul>
            <p className="mt-3">{isRTL ? 'شكراً لاختياركم كواليتي لايت.' : 'Thank you for choosing Quality Light.'}</p>
          </footer>
        </article>
      </div>
    </StorefrontLayout>
  );
}
