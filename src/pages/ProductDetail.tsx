import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Banknote, ChevronDown, FileText, Heart, Loader2, MapPin, MessageCircle, Minus, Pencil, Plus, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductRail from '@/components/storefront/ProductRail';
import ProductReviews, { useProductReviews } from '@/components/storefront/ProductReviews';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useCatalog } from '@/hooks/useCatalog';
import { useSEO } from '@/hooks/useSEO';
import { absoluteUrl, breadcrumbSchema, productSchema } from '@/lib/seo';
import { resolveImageUrl } from '@/lib/image-resolver';
import { parseProductSpecs } from '@/lib/spec-helper';
import { departmentOfCategory, isStudioImage } from '@/lib/store-nav';

interface ProductVariation {
  id: string;
  name_en: string | null;
  name_ar: string | null;
  size: string | null;
  wattage: string | null;
  price_modifier: number | null;
  stock_quantity: number | null;
}

interface ProductImage { id: string; url: string; is_primary: boolean | null; sort_order: number | null }

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  short_description_en: string | null;
  short_description_ar: string | null;
  base_price: number;
  sale_price: number | null;
  sku: string | null;
  stock_quantity: number | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  is_featured: boolean | null;
  specifications: Record<string, string> | null;
  category_id: string | null;
}

const WHATSAPP = '96551111725';

// Product page: gallery, price, quantity, add to cart / buy now, details, reviews, related products
const ProductDetail = () => {
  const { slug } = useParams();
  const { isRTL, language } = useLanguage();
  const { isAdmin } = useAuth();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products: catalog, categories } = useCatalog();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [variation, setVariation] = useState<ProductVariation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState<'cart' | 'buy' | null>(null);
  const [open, setOpen] = useState<string | null>('description');
  const { data: reviews = [] } = useProductReviews(product?.id);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      setLoading(true);
      setProduct(null);
      setSelected(0);
      setQuantity(1);
      const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
      if (cancelled) return;
      if (!data) { setLoading(false); return; }
      const [{ data: imageRows }, { data: variationRows }] = await Promise.all([
        supabase.from('product_images').select('id, url, is_primary, sort_order').eq('product_id', data.id)
          .order('is_primary', { ascending: false }).order('sort_order', { ascending: true }),
        supabase.from('product_variations').select('id, name_en, name_ar, size, wattage, price_modifier, stock_quantity').eq('product_id', data.id).eq('is_active', true),
      ]);
      if (cancelled) return;
      setProduct({ ...data, specifications: data.specifications as Record<string, string> | null } as Product);
      setImages(imageRows || []);
      setVariations(variationRows || []);
      setVariation(variationRows?.[0] || null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const name = product ? (isRTL ? product.name_ar || product.name_en : product.name_en) : '';
  const basePrice = product ? (product.sale_price && product.sale_price > 0 ? product.sale_price : product.base_price) : 0;
  const price = basePrice + (variation?.price_modifier || 0);
  // Items without a price are sold on request through WhatsApp
  const onRequest = !(price > 0);
  const original = product?.sale_price && product.sale_price > 0 && product.base_price > product.sale_price ? product.base_price + (variation?.price_modifier || 0) : null;
  const discount = original ? Math.round(((original - price) / original) * 100) : 0;
  const description = product ? (isRTL ? product.description_ar || product.short_description_ar : product.description_en || product.short_description_en) : '';
  const gallery = product ? (images.length ? images : [{ id: 'none', url: '', is_primary: true, sort_order: 0 }]).map((i) => resolveImageUrl(i.url, 'product', product.slug)) : [];
  const category = categories.find((c) => c.id === product?.category_id);
  const dept = departmentOfCategory(category?.slug);
  const currency = isRTL ? 'د.ك' : 'KD';

  useSEO({
    title: product
      ? (onRequest ? (isRTL ? `${name} | كواليتي لايت الكويت` : `${name} | Buy in Kuwait`) : (isRTL ? `${name} | السعر في الكويت ${basePrice.toFixed(3)} د.ك` : `${name} | Price in Kuwait ${basePrice.toFixed(3)} KWD`))
      : (isRTL ? 'منتج' : 'Product'),
    description: description || (isRTL ? `${name} من كواليتي لايت مع التوصيل لجميع مناطق الكويت.` : `${name} from Quality Light with delivery across Kuwait.`),
    image: gallery[0],
    type: 'product',
    // Hidden or unknown products must not be indexed
    noindex: !loading && !product,
    jsonLd: product ? [
      productSchema({
        name, description, images: gallery, sku: product.sku, price: basePrice,
        inStock: product.stock_quantity === null || product.stock_quantity > 0,
        url: absoluteUrl(`/product/${product.slug}`, language), reviews,
      }),
      breadcrumbSchema([
        { name: isRTL ? 'الرئيسية' : 'Home', url: absoluteUrl('/', language) },
        { name: isRTL ? 'المتجر' : 'Shop', url: absoluteUrl('/shop', language) },
        { name, url: absoluteUrl(`/product/${product.slug}`, language) },
      ]),
    ].filter(Boolean) as object[] : null,
  });

  const specRows = useMemo(() => {
    if (!product) return [];
    const s = parseProductSpecs(product.specifications, product.slug, product.name_en);
    return ([
      [isRTL ? 'رمز المنتج' : 'Item code', product.sku || ''],
      [isRTL ? 'القدرة' : 'Power', s.wattage],
      [isRTL ? 'الجهد' : 'Voltage', s.voltage],
      [isRTL ? 'شدة الإضاءة' : 'Luminous flux', s.lumens],
      [isRTL ? 'حرارة اللون' : 'Colour temperature', s.cct],
      [isRTL ? 'زاوية الإضاءة' : 'Beam angle', s.beam_angle],
      [isRTL ? 'درجة الحماية' : 'IP rating', s.ip_rating],
      [isRTL ? 'فتحة القص' : 'Cut-out', s.cutout_size],
      [isRTL ? 'الخامة' : 'Material', s.material],
      [isRTL ? 'الكفالة' : 'Warranty', s.warranty],
    ] as Array<[string, string]>).filter(([, v]) => v && !/n\/a/i.test(v));
  }, [product, isRTL]);

  const related = useMemo(() => {
    if (!product) return [];
    const same = catalog.filter((p) => p.category_id === product.category_id && p.id !== product.id);
    return same.sort((a, b) => Number(a.stock_photo) - Number(b.stock_photo)).slice(0, 12);
  }, [catalog, product]);

  const add = async (thenBuy: boolean) => {
    if (!product) return;
    setBusy(thenBuy ? 'buy' : 'cart');
    try {
      await addItem(product.id, quantity, variation?.id);
      if (thenBuy) navigate('/checkout');
      else toast.success(isRTL ? 'أضيف إلى السلة' : 'Added to cart', { description: `${name} × ${quantity}` });
    } catch {
      toast.error(isRTL ? 'تعذّرت الإضافة إلى السلة' : 'Could not add to cart');
    } finally {
      setBusy(null);
    }
  };

  const whatsapp = () => {
    const link = `${window.location.origin}/product/${product?.slug}`;
    const text = isRTL
      ? `السلام عليكم، ${onRequest ? 'أرجو إرسال سعر' : 'أود الاستفسار عن'}: ${name}${product?.sku ? ` (${product.sku})` : ''}\nالكمية: ${quantity}\n${link}`
      : `Hello, ${onRequest ? 'please send me the price of' : 'I have a question about'}: ${name}${product?.sku ? ` (${product.sku})` : ''}\nQuantity: ${quantity}\n${link}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="container grid gap-8 py-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-neutral-100" />
          <div className="space-y-4"><div className="h-8 w-3/4 animate-pulse rounded bg-neutral-100" /><div className="h-6 w-1/3 animate-pulse rounded bg-neutral-100" /><div className="h-12 w-full animate-pulse rounded-full bg-neutral-100" /></div>
        </div>
      </StorefrontLayout>
    );
  }

  // Unknown or hidden product: a real "not available" page (noindex)
  if (!product) {
    return (
      <StorefrontLayout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-extrabold md:text-3xl">{isRTL ? 'هذا المنتج غير متوفر' : 'This product is no longer available'}</h1>
          <p className="mx-auto mt-3 max-w-md text-neutral-600">{isRTL ? 'ربما تم استبداله بمنتج أحدث. تصفح المتجر أو اطلب عرض سعر وسنساعدك.' : 'It may have been replaced by a newer item. Browse the shop or request a quotation and we will help.'}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary">{isRTL ? 'تصفح المتجر' : 'Browse the shop'}</Link>
            <Link to="/quote" className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold hover:border-neutral-900">{isRTL ? 'اطلب عرض سعر' : 'Request a quotation'}</Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  const wished = isInWishlist(product.id);
  const sections: Array<[string, string, React.ReactNode]> = [
    ['description', isRTL ? 'الوصف' : 'Description', <p key="d" className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">{description || (isRTL ? 'تواصل معنا عبر واتساب لأي تفاصيل إضافية.' : 'Ask us on WhatsApp for any further details.')}</p>],
    ['specs', isRTL ? 'المواصفات' : 'Specifications', (
      <dl key="s" className="divide-y divide-neutral-100 text-sm">
        {specRows.map(([k, v]) => (<div key={k} className="flex justify-between gap-6 py-2.5"><dt className="text-neutral-500">{k}</dt><dd className="text-end font-semibold text-neutral-900" dir="auto">{v}</dd></div>))}
      </dl>
    )],
    ['delivery', isRTL ? 'التوصيل والاسترجاع' : 'Delivery & returns', (
      <div key="r" className="space-y-2 text-sm leading-relaxed text-neutral-600">
        <p>{isRTL ? 'نوصل لجميع مناطق الكويت. تُحسب رسوم التوصيل عند إتمام الطلب، والدفع عند الاستلام.' : 'We deliver across Kuwait. The delivery fee is shown at checkout, and you pay cash on delivery.'}</p>
        <p>{isRTL ? 'يمكنك أيضاً استلام طلبك من معرضنا في حولي – شارع تونس.' : 'You can also collect from our showroom on Tunis Street, Hawalli.'}</p>
        <p><Link to="/returns" className="font-semibold text-primary hover:underline">{isRTL ? 'سياسة الاسترجاع والاستبدال' : 'Returns & exchange policy'}</Link></p>
      </div>
    )],
  ];

  return (
    <StorefrontLayout>
      <div className="container py-6 md:py-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <Link to="/" className="hover:text-primary">{isRTL ? 'الرئيسية' : 'Home'}</Link><span>/</span>
          {dept && (<><Link to={`/shop?dept=${dept.id}`} className="hover:text-primary">{isRTL ? dept.ar : dept.en}</Link><span>/</span></>)}
          {category && (<><Link to={`/shop?category=${category.slug}`} className="hover:text-primary">{isRTL ? category.name_ar || category.name_en : category.name_en}</Link><span>/</span></>)}
          <span className="text-neutral-900">{name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-48 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f5f5f6]">
              {gallery[selected] ? <img src={gallery[selected]} alt={name} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-7xl">💡</span>}
              <span className="absolute start-4 top-4 flex flex-col items-start gap-1.5">
                {discount > 0 && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">−{discount}%</span>}
                {product.is_new && <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold text-white">{isRTL ? 'جديد' : 'New'}</span>}
              </span>
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button key={src + i} type="button" onClick={() => setSelected(i)} aria-label={`${i + 1}`}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f6] ring-2 ring-offset-2 ${i === selected ? 'ring-neutral-900' : 'ring-transparent'}`}>
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {isStudioImage(images[selected]?.url) && (
              <p className="mt-2 text-xs text-neutral-400">{isRTL ? 'الصورة توضيحية، وقد يختلف شكل المنتج قليلاً.' : 'Illustrative image; the actual product may differ slightly.'}</p>
            )}
          </div>

          {/* Buying panel */}
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-neutral-900 md:text-4xl">{name}</h1>
            {product.sku && <p className="mt-2 text-xs text-neutral-500">{isRTL ? 'رمز المنتج' : 'Item code'}: <span dir="ltr">{product.sku}</span></p>}

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {onRequest ? (
                <span className="text-2xl font-extrabold text-emerald-700">{isRTL ? 'السعر عند الطلب' : 'Price on request'}</span>
              ) : (
                <>
                  <span className={`text-3xl font-extrabold ${original ? 'text-red-600' : 'text-neutral-900'}`}>{price.toFixed(3)} <span className="text-lg">{currency}</span></span>
                  {original && <span className="text-lg text-neutral-400 line-through">{original.toFixed(3)}</span>}
                  {discount > 0 && <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">{isRTL ? `وفّر ${discount}%` : `Save ${discount}%`}</span>}
                </>
              )}
            </div>

            {variations.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold">{isRTL ? 'الخيار' : 'Option'}</p>
                <div className="flex flex-wrap gap-2">
                  {variations.map((v) => (
                    <button key={v.id} type="button" onClick={() => setVariation(v)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${variation?.id === v.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 hover:border-neutral-900'}`}>
                      {v.size || v.wattage || (isRTL ? v.name_ar : v.name_en)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <p className="text-sm font-bold">{isRTL ? 'الكمية' : 'Quantity'}</p>
              <div className="flex items-center rounded-full border border-neutral-300">
                <button type="button" onClick={() => setQuantity((n) => Math.max(1, n - 1))} disabled={quantity <= 1} aria-label="-" className="flex h-11 w-11 items-center justify-center disabled:opacity-30"><Minus className="h-4 w-4" /></button>
                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.round(Number(e.target.value) || 1)))} aria-label={isRTL ? 'الكمية' : 'Quantity'}
                  className="h-11 w-14 bg-transparent text-center text-sm font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                <button type="button" onClick={() => setQuantity((n) => n + 1)} aria-label="+" className="flex h-11 w-11 items-center justify-center"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {onRequest ? (
                <button type="button" onClick={whatsapp} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-base font-bold text-white transition hover:bg-emerald-700">
                  <MessageCircle className="h-5 w-5" />{isRTL ? 'اطلب السعر عبر واتساب' : 'Ask for the price on WhatsApp'}
                </button>
              ) : (
                <>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => add(false)} disabled={!!busy} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 text-base font-bold text-white transition hover:bg-primary disabled:opacity-70">
                      {busy === 'cart' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}{isRTL ? 'أضف إلى السلة' : 'Add to cart'}
                    </button>
                    <button type="button" onClick={() => toggleWishlist(product)} aria-label={isRTL ? 'المفضلة' : 'Wishlist'} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-900">
                      <Heart className={`h-5 w-5 ${wished ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                  <button type="button" onClick={() => add(true)} disabled={!!busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-white transition hover:brightness-95 disabled:opacity-70">
                    {busy === 'buy' && <Loader2 className="h-5 w-5 animate-spin" />}{isRTL ? 'اشترِ الآن' : 'Buy it now'}
                  </button>
                  <button type="button" onClick={whatsapp} className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-600 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
                    <MessageCircle className="h-4 w-4" />{isRTL ? 'اسأل عبر واتساب' : 'Ask on WhatsApp'}
                  </button>
                </>
              )}
              <Link to={`/quote?sku=${encodeURIComponent(product.sku || '')}&qty=${quantity}`} className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-neutral-600 hover:text-primary">
                <FileText className="h-4 w-4" />{isRTL ? 'كمية كبيرة؟ اطلب عرض سعر رسمي' : 'Buying in bulk? Request an official quotation'}
              </Link>
            </div>

            <ul className="mt-6 grid gap-2.5 rounded-2xl bg-[#f5f5f6] p-5 text-sm text-neutral-700">
              <li className="flex items-center gap-3"><Truck className="h-4 w-4 shrink-0 text-primary" />{isRTL ? 'توصيل لجميع مناطق الكويت' : 'Delivery across Kuwait'}</li>
              <li className="flex items-center gap-3"><Banknote className="h-4 w-4 shrink-0 text-primary" />{isRTL ? 'الدفع عند الاستلام' : 'Cash on delivery'}</li>
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-primary" />{isRTL ? 'متوفر في معرضنا في حولي – شارع تونس' : 'Available at our showroom on Tunis Street, Hawalli'}</li>
            </ul>

            <div className="mt-6 border-t border-neutral-200">
              {sections.filter(([key]) => key !== 'specs' || specRows.length > 0).map(([key, title, body]) => (
                <div key={key} className="border-b border-neutral-200">
                  <button type="button" onClick={() => setOpen(open === key ? null : key)} className="flex w-full items-center justify-between py-4 text-start text-base font-bold">
                    {title}<ChevronDown className={`h-4 w-4 transition-transform ${open === key ? 'rotate-180' : ''}`} />
                  </button>
                  {open === key && <div className="pb-5">{body}</div>}
                </div>
              ))}
            </div>

            {isAdmin && (
              <Link to={`/admin/products/${product.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <Pencil className="h-4 w-4" />{isRTL ? 'تعديل المنتج' : 'Edit product'}
              </Link>
            )}
          </div>
        </div>

        <section className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="mb-6 text-xl font-extrabold tracking-tight md:text-2xl">{isRTL ? 'تقييمات العملاء' : 'Customer reviews'}</h2>
          <ProductReviews productId={product.id} />
        </section>
      </div>

      <ProductRail title={isRTL ? 'منتجات مشابهة' : 'You may also like'} products={related} href={category ? `/shop?category=${category.slug}` : '/shop'} />
      <div className="h-8" />
    </StorefrontLayout>
  );
};

export default ProductDetail;
