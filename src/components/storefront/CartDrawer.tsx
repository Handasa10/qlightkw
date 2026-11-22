import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { priceOf, useCatalog } from '@/hooks/useCatalog';
import { useStoreUI } from '@/contexts/StoreUIContext';
import { companionsFor } from '@/lib/companions';
import { resolveImageUrl } from '@/lib/image-resolver';

const DELIVERY_FEE = 3;

// Slide-out cart: opens after every add, shows the order and suggests what completes the installation
const CartDrawer = () => {
  const { isRTL } = useLanguage();
  const { cartOpen, setCartOpen, lastAdded, celebrateAdd } = useStoreUI();
  const { items, subtotal, isLoading, addItem, removeItem, updateQuantity } = useCart();
  const { products } = useCatalog();
  const navigate = useNavigate();
  const [adding, setAdding] = useState<string | null>(null);
  const currency = isRTL ? 'د.ك' : 'KD';

  const inCart = items.map((i) => i.product_id);
  // Suggestions follow the product just added, else the last item in the cart
  const anchorName = lastAdded?.name_en || items[items.length - 1]?.product?.name_en || '';
  const suggestions = useMemo(() => companionsFor(anchorName, products, inCart, 3), [anchorName, products, inCart.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSuggestion = async (id: string, e: React.MouseEvent) => {
    const product = products.find((p) => p.id === id) || null;
    setAdding(id);
    try {
      await addItem(id, 1);
      celebrateAdd(product, (e.currentTarget as HTMLElement).closest('[data-suggestion]'), product?.image_url);
    } catch {
      toast.error(isRTL ? 'تعذّرت الإضافة' : 'Could not add');
    } finally {
      setAdding(null);
    }
  };

  const goCheckout = () => { setCartOpen(false); navigate('/checkout'); };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={isRTL ? 'left' : 'right'} className="store-light flex w-full flex-col gap-0 bg-white p-0 text-neutral-900 sm:max-w-md [&>button]:hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-extrabold text-neutral-900">
            <ShoppingBag className="h-5 w-5" />{isRTL ? 'سلة التسوق' : 'Your cart'}
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">{items.reduce((n, i) => n + i.quantity, 0)}</span>
          </SheetTitle>
          <button type="button" onClick={() => setCartOpen(false)} aria-label={isRTL ? 'إغلاق' : 'Close'} className="rounded-full p-2 hover:bg-neutral-100"><X className="h-5 w-5" /></button>
        </div>

        {lastAdded && items.some((i) => i.product_id === lastAdded.id) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800">
            <Check className="h-4 w-4" />{isRTL ? 'تمت الإضافة إلى السلة' : 'Added to your cart'}
          </motion.div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <motion.div initial={{ scale: 0.8, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f5f6]">
                <ShoppingBag className="h-9 w-9 text-neutral-400" />
              </motion.div>
              <p className="mt-5 text-lg font-bold">{isRTL ? 'سلتك فارغة' : 'Your cart is empty'}</p>
              <p className="mt-1 text-sm text-neutral-500">{isRTL ? 'ابدأ بإضافة ما تحتاجه لمشروعك' : 'Start adding what your project needs'}</p>
              <button type="button" onClick={() => { setCartOpen(false); navigate('/shop'); }} className="mt-6 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary">{isRTL ? 'تسوق الآن' : 'Start shopping'}</button>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100 px-5">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const p = item.product;
                  const unit = (p?.sale_price && p.sale_price > 0 ? p.sale_price : p?.base_price || 0) + (item.variation?.price_modifier || 0);
                  return (
                    <motion.li key={item.id} layout initial={{ opacity: 0, x: isRTL ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 py-4">
                      <Link to={`/product/${p?.slug}`} onClick={() => setCartOpen(false)} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f6]">
                        {p?.image_url && <img src={resolveImageUrl(p.image_url, 'product', p.slug)} alt="" className="h-full w-full object-cover" />}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link to={`/product/${p?.slug}`} onClick={() => setCartOpen(false)} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">{isRTL ? p?.name_ar || p?.name_en : p?.name_en}</Link>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-neutral-200">
                            <button type="button" onClick={() => (item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id))} aria-label="-" className="flex h-8 w-8 items-center justify-center">
                              {item.quantity > 1 ? <Minus className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5 text-red-500" />}
                            </button>
                            <motion.span key={item.quantity} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-7 text-center text-sm font-bold">{item.quantity}</motion.span>
                            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="+" className="flex h-8 w-8 items-center justify-center"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <span className="text-sm font-bold">{(unit * item.quantity).toFixed(3)} {currency}</span>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}

          {items.length > 0 && suggestions.length > 0 && (
            <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4">
              <p className="flex items-center gap-2 text-sm font-extrabold text-neutral-900"><Sparkles className="h-4 w-4 text-primary" />{isRTL ? 'أكمل التركيب' : 'Complete the installation'}</p>
              <p className="mt-0.5 text-xs text-neutral-600">{isRTL ? suggestions[0].why.ar : suggestions[0].why.en}</p>
              <div className="mt-3 space-y-2">
                {suggestions.map(({ product }) => (
                  <div key={product.id} data-suggestion className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f6]">{product.image_url && <img src={product.image_url} alt="" className="h-full w-full object-cover" />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-xs font-semibold">{isRTL ? product.name_ar : product.name_en}</span>
                      <span className="text-xs font-bold text-neutral-900">{priceOf(product).toFixed(3)} {currency}</span>
                    </span>
                    <button type="button" onClick={(e) => addSuggestion(product.id, e)} disabled={adding === product.id} className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-neutral-900 px-3 text-xs font-bold text-white hover:bg-primary disabled:opacity-60">
                      {adding === product.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}{isRTL ? 'أضف' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-5">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600">{isRTL ? 'المجموع' : 'Subtotal'}</span><span className="font-bold">{subtotal.toFixed(3)} {currency}</span></div>
              <div className="flex justify-between text-neutral-500"><span>{isRTL ? 'التوصيل' : 'Delivery'}</span><span>{isRTL ? `من ${DELIVERY_FEE.toFixed(3)} د.ك` : `from ${DELIVERY_FEE.toFixed(3)} KD`}</span></div>
            </div>
            <button type="button" onClick={goCheckout} className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-white transition hover:brightness-95">
              {isRTL ? 'إتمام الطلب' : 'Checkout'} · {subtotal.toFixed(3)} {currency}
            </button>
            <button type="button" onClick={() => { setCartOpen(false); navigate('/cart'); }} className="mt-2 w-full py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900">{isRTL ? 'عرض السلة' : 'View cart'}</button>
            <p className="text-center text-xs text-neutral-500">{isRTL ? 'الدفع عند الاستلام' : 'Cash on delivery'}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
