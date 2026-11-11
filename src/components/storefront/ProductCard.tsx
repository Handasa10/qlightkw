import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, MessageCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { resolveImageUrl } from '@/lib/image-resolver';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  is_featured: boolean | null;
  image_url?: string | null;
  secondary_image_url?: string | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Store product card: photo on a soft grey tile, name, price, one-tap add to cart
const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product }, ref) => {
  const { isRTL } = useLanguage();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const name = isRTL ? product.name_ar || product.name_en : product.name_en;
  const price = product.sale_price && product.sale_price > 0 ? product.sale_price : product.base_price;
  // Items without a price are sold on request through WhatsApp
  const onRequest = !(price > 0);
  const original = product.sale_price && product.sale_price > 0 && product.base_price > product.sale_price ? product.base_price : null;
  const discount = original ? Math.round(((original - price) / original) * 100) : 0;
  const wished = isInWishlist(product.id);
  const image = resolveImageUrl(product.image_url, 'product', product.slug);
  const hover = product.secondary_image_url && product.secondary_image_url !== product.image_url ? product.secondary_image_url : null;
  const currency = isRTL ? 'د.ك' : 'KD';

  const add = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(product.id, 1);
      toast.success(isRTL ? 'أضيف إلى السلة' : 'Added to cart', { description: name });
    } catch {
      toast.error(isRTL ? 'تعذّرت الإضافة إلى السلة' : 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const wish = async (e: React.MouseEvent) => {
    e.preventDefault();
    try { await toggleWishlist(product); } catch { toast.error(isRTL ? 'تعذّر تحديث المفضلة' : 'Could not update wishlist'); }
  };

  const askPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = `${window.location.origin}/product/${product.slug}`;
    const text = isRTL ? `السلام عليكم، أرجو إرسال سعر: ${name}\n${link}` : `Hello, please send me the price of: ${name}\n${link}`;
    window.open(`https://wa.me/96551111725?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <div ref={ref} className="group relative flex h-full flex-col">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-[#f5f5f6]">
        {image && !imgError ? (
          <>
            <img src={image} alt={name} loading="lazy" onError={() => setImgError(true)}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${hover ? 'group-hover:opacity-0' : ''}`} />
            {hover && <img src={hover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" />}
          </>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl">💡</span>
        )}

        <span className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">−{discount}%</span>}
          {product.is_new && <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-bold text-white">{isRTL ? 'جديد' : 'New'}</span>}
          {product.is_bestseller && !discount && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-900 shadow-sm">{isRTL ? 'الأكثر مبيعاً' : 'Best seller'}</span>}
        </span>

        <button type="button" onClick={wish} aria-label={isRTL ? 'المفضلة' : 'Wishlist'}
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110">
          <Heart className={`h-[18px] w-[18px] ${wished ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
        </button>

        {onRequest ? (
          <button type="button" onClick={askPrice} aria-label={isRTL ? 'اطلب السعر عبر واتساب' : 'Ask for price on WhatsApp'}
            className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700">
            <MessageCircle className="h-5 w-5" />
          </button>
        ) : (
          <button type="button" onClick={add} disabled={adding} aria-label={isRTL ? 'أضف للسلة' : 'Add to cart'}
            className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition hover:bg-primary disabled:opacity-70">
            {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          </button>
        )}
      </Link>

      <Link to={`/product/${product.slug}`} className="mt-3 flex flex-1 flex-col px-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900 group-hover:text-primary">{name}</h3>
        <p className="mt-1.5 flex items-baseline gap-2">
          {onRequest ? (
            <span className="text-sm font-semibold text-emerald-700">{isRTL ? 'اطلب السعر' : 'Price on request'}</span>
          ) : (
            <>
              <span className={`text-[15px] font-bold ${original ? 'text-red-600' : 'text-neutral-900'}`}>{price.toFixed(3)} {currency}</span>
              {original && <span className="text-xs text-neutral-400 line-through">{original.toFixed(3)}</span>}
            </>
          )}
        </p>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
