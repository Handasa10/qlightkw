import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { priceOf } from '@/hooks/useCatalog';
import { useStoreUI } from '@/contexts/StoreUIContext';
import { parseProductSpecs } from '@/lib/spec-helper';

// Quick view: look at a product and add it to the cart without leaving the page
const QuickView = () => {
  const { isRTL } = useLanguage();
  const { quickView: p, setQuickView, celebrateAdd } = useStoreUI();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  if (!p) return null;
  const name = isRTL ? p.name_ar || p.name_en : p.name_en;
  const price = priceOf(p);
  const onRequest = !(price > 0);
  const original = p.sale_price && p.sale_price > 0 && p.base_price > p.sale_price ? p.base_price : null;
  const specs = parseProductSpecs(null, p.slug, p.name_en);
  const chips = [specs.wattage, specs.cct.split(' ')[0], specs.ip_rating, specs.voltage].filter(Boolean);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const add = async (e: React.MouseEvent) => {
    setBusy(true);
    try {
      await addItem(p.id, quantity);
      const img = (e.currentTarget as HTMLElement).closest('[data-qv]')?.querySelector('img');
      setQuickView(null);
      setQuantity(1);
      celebrateAdd(p, img, p.image_url);
    } catch {
      toast.error(isRTL ? 'تعذّرت الإضافة إلى السلة' : 'Could not add to cart');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!p} onOpenChange={(open) => { if (!open) { setQuickView(null); setQuantity(1); } }}>
      <DialogContent className="store-light max-w-3xl overflow-hidden rounded-3xl border-0 bg-white p-0 text-neutral-900 sm:rounded-3xl">
        <div data-qv className="grid md:grid-cols-2">
          <div className="aspect-square bg-[#f5f5f6]">
            {p.image_url && <img src={p.image_url} alt={name} className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <DialogTitle className="text-xl font-extrabold leading-tight text-neutral-900 md:text-2xl">{name}</DialogTitle>
            {p.sku && <p className="mt-1 text-xs text-neutral-500">{isRTL ? 'رمز المنتج' : 'Item code'}: <span dir="ltr">{p.sku}</span></p>}
            <p className="mt-4 flex items-baseline gap-2">
              {onRequest ? <span className="text-xl font-extrabold text-emerald-700">{isRTL ? 'السعر عند الطلب' : 'Price on request'}</span> : (
                <>
                  <span className={`text-2xl font-extrabold ${original ? 'text-red-600' : ''}`}>{price.toFixed(3)} {isRTL ? 'د.ك' : 'KD'}</span>
                  {original && <span className="text-sm text-neutral-400 line-through">{original.toFixed(3)}</span>}
                </>
              )}
            </p>
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => <span key={c} className="rounded-full bg-[#f5f5f6] px-3 py-1 text-xs font-semibold" dir="ltr">{c}</span>)}
              </div>
            )}
            <div className="mt-auto space-y-3 pt-6">
              {onRequest ? (
                <a href={`https://wa.me/96551111725?text=${encodeURIComponent(`${isRTL ? 'أرجو إرسال سعر' : 'Please send me the price of'}: ${name}\n${window.location.origin}/product/${p.slug}`)}`} target="_blank" rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700">
                  <MessageCircle className="h-4 w-4" />{isRTL ? 'اطلب السعر عبر واتساب' : 'Ask for the price on WhatsApp'}
                </a>
              ) : (
                <div className="flex gap-3">
                  <div className="flex items-center rounded-full border border-neutral-300">
                    <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} aria-label="-" className="flex h-12 w-10 items-center justify-center"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((n) => n + 1)} aria-label="+" className="flex h-12 w-10 items-center justify-center"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button type="button" onClick={add} disabled={busy} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-bold text-white hover:bg-primary disabled:opacity-70">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}{isRTL ? 'أضف إلى السلة' : 'Add to cart'}
                  </button>
                </div>
              )}
              <Link to={`/product/${p.slug}`} onClick={() => setQuickView(null)} className="flex items-center justify-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-primary">
                {isRTL ? 'كل التفاصيل' : 'Full details'}<Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickView;
