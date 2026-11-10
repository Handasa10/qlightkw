import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { parseProductSpecs } from '@/lib/spec-helper';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Heart,
  ShoppingCart,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Loader2,
  MessageCircle,
  FileText,
  Download,
  Building2,
  Briefcase,
  Layers,
  Wrench,
  CheckSquare,
  Square,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeStorageUrl } from '@/lib/storage';
import { resolveImageUrl, resolveSecondaryImageUrl } from '@/lib/image-resolver';
import { useSEO } from '@/hooks/useSEO';
import { productSchema, breadcrumbSchema, absoluteUrl } from '@/lib/seo';
import ProductReviews, { useProductReviews } from '@/components/storefront/ProductReviews';

interface ProductVariation {
  id: string;
  name_en: string | null;
  name_ar: string | null;
  color: string | null;
  color_hex: string | null;
  size: string | null;
  wattage: string | null;
  price_modifier: number | null;
  stock_quantity: number | null;
  image_url: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt_text_en: string | null;
  alt_text_ar: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
}

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
  specifications: Record<string, any> | null;
  category_id: string | null;
  brand_id: string | null;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { isAdmin } = useAuth();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const { data: productReviews = [] } = useProductReviews(product?.id);
  const seoName = product ? (isRTL ? product.name_ar || product.name_en : product.name_en) : '';
  const seoPrice = product ? (product.sale_price || product.base_price) : 0;
  const seoDescription = product
    ? ((isRTL ? product.short_description_ar || product.description_ar : product.short_description_en || product.description_en)
      || (isRTL ? `${seoName} بسعر ${seoPrice.toFixed(3)} د.ك مع ضمان وتوصيل سريع في الكويت.` : `${seoName} for ${seoPrice.toFixed(3)} KWD with warranty and fast delivery in Kuwait.`))
    : '';
  const seoImages = product ? (images.length ? images : [{ url: '' } as ProductImage]).map((img) => resolveImageUrl(img.url, 'product', product.slug)) : [];
  useSEO({
    title: product
      ? (seoPrice > 0
        ? (isRTL ? `${seoName} | السعر في الكويت ${seoPrice.toFixed(3)} د.ك` : `${seoName} | Price in Kuwait ${seoPrice.toFixed(3)} KWD`)
        : (isRTL ? `${seoName} | كواليتي لايت الكويت` : `${seoName} | Buy in Kuwait`))
      : (isRTL ? 'منتج' : 'Product'),
    description: seoDescription,
    image: seoImages[0],
    type: 'product',
    // Hidden or unknown products must not be indexed (they used to render the demo product)
    noindex: !loading && !product,
    jsonLd: product ? [
      productSchema({
        name: seoName,
        description: seoDescription,
        images: seoImages,
        sku: product.sku,
        price: seoPrice,
        inStock: product.stock_quantity === null || product.stock_quantity > 0,
        url: absoluteUrl(`/product/${product.slug}`, language),
        reviews: productReviews,
      }),
      breadcrumbSchema([
        { name: isRTL ? 'الرئيسية' : 'Home', url: absoluteUrl('/', language) },
        { name: isRTL ? 'المتجر' : 'Shop', url: absoluteUrl('/shop', language) },
        { name: seoName, url: absoluteUrl(`/product/${product.slug}`, language) },
      ]),
    ].filter(Boolean) as object[] : null,
  });
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bundle states (Frequently bought together)
  const [includeDriver, setIncludeDriver] = useState(true);
  const [includeChannel, setIncludeChannel] = useState(false);

  const handleDeleteProduct = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      // Delete images
      await supabase.from('product_images').delete().eq('product_id', product.id);
      // Delete variations
      await supabase.from('product_variations').delete().eq('product_id', product.id);
      // Delete product
      const { error } = await supabase.from('products').delete().eq('id', product.id);

      if (error) throw error;
      toast.success(t('admin.productDeleted', 'Product deleted successfully'));
      navigate('/shop');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(t('admin.deleteError', 'Failed to delete product'));
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);

      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (productError || !productData) {
        setLoading(false);
        return;
      }

      const typedProduct: Product = {
        ...productData,
        specifications: productData.specifications as Record<string, string> | null,
      };

      setProduct(typedProduct);

      // Fetch images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', typedProduct.id)
        .order('is_primary', { ascending: false })
        .order('sort_order', { ascending: true });

      if (imagesData) setImages(imagesData);

      // Fetch variations
      const { data: variationsData } = await supabase
        .from('product_variations')
        .select('*')
        .eq('product_id', typedProduct.id)
        .eq('is_active', true);

      if (variationsData) {
        setVariations(variationsData);
        if (variationsData.length > 0) {
          setSelectedVariation(variationsData[0]);
        }
      }

      // Fetch related products
      if (typedProduct.category_id) {
        const { data: related } = await supabase
          .from('products')
          .select('id, name_en, name_ar, slug, base_price, sale_price, is_new, is_bestseller, is_featured, category_id, brand_id, specifications')
          .eq('category_id', typedProduct.category_id)
          .eq('is_active', true)
          .neq('id', typedProduct.id)
          .limit(4);

        if (related) {
          // Fetch related primary images
          const relatedIds = related.map(r => r.id);
          if (relatedIds.length > 0) {
            const { data: relImages } = await supabase
              .from('product_images')
              .select('product_id, url, is_primary')
              .in('product_id', relatedIds)
              .eq('is_primary', true);

            const mappedRelated = related.map(rel => {
              const img = relImages?.find(i => i.product_id === rel.id);
              return {
                ...rel,
                image_url: img?.url || null
              } as any;
            });
            setRelatedProducts(mappedRelated);
          }
        }
      }
      setLoading(false);
    };

    fetchProduct();
    setSelectedImage(0);
    setQuantity(1);
  }, [slug]);

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % Math.max(images.length, 1));
  };

  const handleAddToCart = async () => {
    if (!displayProduct) return;
    setIsAddingToCart(true);
    try {
      await addItem(displayProduct.id, quantity, selectedVariation?.id);
      toast.success(t('cart.itemAdded', 'Added to cart!'), {
        description: `${name} x${quantity}`,
      });
    } catch (error) {
      toast.error(t('cart.addError', 'Failed to add to cart'));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!displayProduct) return;
    setIsAddingToCart(true);
    try {
      // 1. Add current main product
      await addItem(displayProduct.id, quantity, selectedVariation?.id);
      
      // 2. Add driver if checked (mock ID / or associate driver product if present)
      if (includeDriver) {
        // Find if a driver exists, or add a simulated bundle addon
        toast.info(isRTL ? "تم إضافة المحول الكهربائي للسلة" : "Transformer driver added to cart");
      }
      
      // 3. Add channel profile if checked
      if (includeChannel) {
        toast.info(isRTL ? "تم إضافة الملف الخطي للسلة" : "Aluminum channel profile added to cart");
      }

      toast.success(isRTL ? "تم إضافة الباقة بالكامل للسلة!" : "Lighting bundle added to cart successfully!");
    } catch (err) {
      toast.error("Failed to add bundle");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!displayProduct) return;
    try {
      await toggleWishlist(displayProduct);
      toast.success(
        isInWishlist(displayProduct.id)
          ? t('wishlist.removed', 'Removed from wishlist!')
          : t('wishlist.added', 'Added to wishlist!')
      );
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleWhatsAppOrder = () => {
    if (!displayProduct) return;
    const priceText = onRequest ? (isRTL ? 'أرجو إرسال السعر' : 'please send the price') : finalPrice.toFixed(3);
    const message = isRTL
      ? `مرحباً كواليتي لايت، أود الاستفسار عن منتج:\n*${name}*\nالرمز: ${displayProduct.sku || 'N/A'}\nالسعر الحالي: ${priceText} د.ك\nالرابط: ${window.location.href}`
      : `Hello QUALITY LIGHT, I would like to inquire about this product:\n*${name}*\nSKU: ${displayProduct.sku || 'N/A'}\nPrice: ${priceText} KWD\nLink: ${window.location.href}`;

    const url = `https://wa.me/96551111725?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Demo fallback values if no DB entries match
  const demoProduct: Product = {
    id: 'demo-1',
    name_en: 'Architectural Anti-Glare Spotlight',
    name_ar: 'سبوت لايت معمارى مانع للتوهج',
    slug: 'modern-led-chandelier',
    description_en: 'High-end architectural spotlight utilizing premium COB LED chips. Deep recessed reflector reduces glare to UGR < 19, perfect for clean ceilings, luxury villas and boutique showrooms in Kuwait.',
    description_ar: 'سبوت لايت معمارى فاخر يستخدم تقنية COB LED الحديثة. عاكس غائر عميق يمنع توهج العين ويوفر إضاءة مريحة جداً ومطابقة لأرقى تصاميم الفلل الكويتية.',
    short_description_en: 'Premium UGR < 19 anti-glare architectural spot.',
    short_description_ar: 'سبوت لايت معمارى فاخر مانع للتوهج للفلل والمكاتب.',
    base_price: 12.000,
    sale_price: 9.900,
    sku: 'QL-REC-SPT-12',
    stock_quantity: 120,
    is_new: true,
    is_bestseller: true,
    is_featured: true,
    specifications: {
      'wattage': '12W',
      'lumens': '1080 lm',
      'cct': '3-CCT Toggle (3000K/4000K/6000K)',
      'beam_angle': '36° Spotlight',
      'ip_rating': 'IP44 Recessed',
      'cutout_size': 'Ø 75mm',
      'warranty': '3 Years',
      'material': 'Die-cast Aerospace Aluminum',
      'input_voltage': 'AC 220-240V'
    },
    category_id: null,
    brand_id: null,
  };

  const demoVariations: ProductVariation[] = [
    { id: 'v-1', name_en: 'Warm White (3000K)', name_ar: 'أبيض دافئ', color: null, color_hex: null, size: 'Ø 75mm', wattage: '9W', price_modifier: 0, stock_quantity: 50, image_url: null },
    { id: 'v-2', name_en: 'Natural White (4000K)', name_ar: 'أبيض طبيعي', color: null, color_hex: null, size: 'Ø 75mm', wattage: '12W', price_modifier: 2.000, stock_quantity: 40, image_url: null },
  ];

  const displayProduct = product || demoProduct;
  // Demo variations belong to the demo product only; real products show just their own
  const displayVariations = product ? variations : demoVariations;
  const activeVariation = selectedVariation || displayVariations[0];

  const name = language === 'ar' ? displayProduct.name_ar : displayProduct.name_en;
  const description = language === 'ar' ? displayProduct.description_ar : displayProduct.description_en;
  const shortDescription = language === 'ar' ? displayProduct.short_description_ar : displayProduct.short_description_en;

  const basePrice = displayProduct.sale_price || displayProduct.base_price;
  const priceModifier = activeVariation?.price_modifier || 0;
  const finalPrice = basePrice + priceModifier;
  // Items without a price in the inventory are sold on request via WhatsApp
  const onRequest = !(finalPrice > 0);
  const originalPrice = displayProduct.sale_price ? displayProduct.base_price + priceModifier : null;
  const discount = originalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  const stockQuantity = activeVariation?.stock_quantity ?? displayProduct.stock_quantity ?? 0;
  const inStock = stockQuantity > 0;
  const isWishlisted = isInWishlist(displayProduct.id);

  // Specifications parsed via helper fallbacks
  const specs = parseProductSpecs(displayProduct.specifications, displayProduct.slug, displayProduct.name_en);

  const specRows = ([
    [isRTL ? "الجهد الكهربائي" : "Input Voltage", specs.voltage],
    [isRTL ? "القدرة بالواط" : "Power/Wattage", specs.wattage],
    [isRTL ? "شدة الإضاءة (لومن)" : "Luminous Flux (Lumens)", specs.lumens],
    [isRTL ? "درجة حرارة اللون (CCT)" : "Color Temperature (CCT)", specs.cct],
    [isRTL ? "زاوية انتشار الضوء" : "Beam Angle", specs.beam_angle],
    [isRTL ? "مستوى الحماية (IP)" : "IP Protection Rating", specs.ip_rating],
    [isRTL ? "قطر فتحة الجبس (Cutout)" : "Ceiling Cutout Size", specs.cutout_size],
    [isRTL ? "هيكل الجسم والعدسة" : "Body Material", specs.material],
    [isRTL ? "مدة الكفالة" : "Warranty Period", specs.warranty],
    [isRTL ? "رمز المنتج" : "Item Code", displayProduct.sku || ''],
  ] as Array<[string, string]>).filter(([, value]) => value);

  // Application hints only where the product type makes them meaningful (none for wiring items)
  const getRecommendedApps = () => {
    const s = displayProduct.slug.toLowerCase();
    if (s.includes('chandelier')) return [t('apps.villa', 'Luxury Villas'), t('apps.hospitality', 'Hospitality / Restaurants')];
    if (s.includes('strip') || s.includes('profile')) return [t('apps.interior', 'Cove Lighting'), t('apps.office', 'Offices'), t('apps.villas', 'Villas')];
    if (s.includes('outdoor') || s.includes('bollard') || s.includes('flood')) return [t('apps.garden', 'Garden Landscapes'), t('apps.facade', 'Villa Facades'), t('apps.parking', 'Security & Pathways')];
    return [];
  };
  const recommendedApps = getRecommendedApps();

  // Upsell calculation
  const driverPrice = 4.500;
  const profilePrice = 3.000;
  const bundleTotal = finalPrice + (includeDriver ? driverPrice : 0) + (includeChannel ? profilePrice : 0);

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="container py-12">
          <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
            <Skeleton className="aspect-square rounded-2xl bg-muted" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/4 bg-muted" />
              <Skeleton className="h-6 w-1/3 bg-muted" />
              <Skeleton className="h-28 w-full bg-muted" />
              <Skeleton className="h-12 w-full bg-muted" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Unknown or hidden product: a real "not available" page (noindex) instead of the demo product
  if (!product) {
    return (
      <StorefrontLayout>
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">{isRTL ? 'هذا المنتج غير متوفر' : 'This product is no longer available'}</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {isRTL ? 'ربما تم استبداله بمنتج أحدث. تصفح المتجر أو اطلب عرض سعر وسنساعدك.' : 'It may have been replaced by a newer item. Browse the shop or request a quotation and we will help.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to="/shop">{isRTL ? 'تصفح المتجر' : 'Browse the shop'}</Link></Button>
            <Button asChild variant="outline"><Link to="/quote">{isRTL ? 'اطلب عرض سعر' : 'Request a quotation'}</Link></Button>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      {/* Breadcrumbs */}
      <div className="bg-muted/10 py-5 border-b border-border/40">
        <div className="container">
          <nav className="text-xs text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-primary transition-colors">{t('nav.home', 'Home')}</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.products', 'Products')}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] md:max-w-none">{name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* LEFT COLUMN: Gallery & Downloads */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-border/80 shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {images.length > 0 ? (
                    <img
                      src={resolveImageUrl(images[selectedImage]?.url, 'product', displayProduct.slug)}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <span className="text-8xl">💡</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Arrow navigation overlay */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-white/70 dark:bg-slate-900/70 border border-white/10 shadow-md hover:bg-primary hover:text-black transition-colors"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 bg-white/70 dark:bg-slate-900/70 border border-white/10 shadow-md hover:bg-primary hover:text-black transition-colors"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {displayProduct.is_new && (
                  <Badge className="bg-green-600/90 text-white border-none text-[10px] uppercase font-bold py-1 px-2.5 rounded-lg">{t('product.new', 'New')}</Badge>
                )}
                {displayProduct.is_bestseller && (
                  <Badge className="bg-primary/95 text-primary-foreground border-none text-[10px] uppercase font-bold py-1 px-2.5 rounded-lg">{t('product.bestseller', 'Bestseller')}</Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive" className="border-none text-[10px] font-bold py-1 px-2.5 rounded-lg">-{discount}%</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === selectedImage ? 'border-primary scale-102 shadow-md' : 'border-border hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(image.url, 'product', displayProduct.slug)}
                      alt={`thumbnail ${index}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 2. GRAPHICAL CUTOUT / DIMENSIONS GUIDE */}
            {specs.cutout_size && !specs.cutout_size.toLowerCase().includes('n/a') && (
              <div className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 text-center space-y-4">
                <h3 className="font-bold text-sm md:text-base text-foreground text-left flex items-center gap-2 border-b border-border/50 pb-2.5">
                  <Maximize2 className="h-4.5 w-4.5 text-primary" />
                  <span>{isRTL ? "دليل أبعاد فتحة الجبس وسماكة السقف" : "Ceiling Cutout Installation Guide"}</span>
                </h3>
                
                {/* Ceiling cutting circle graphics simulator */}
                <div className="h-32 max-w-sm mx-auto rounded-2xl border-2 border-dashed border-primary/20 dark:border-primary/10 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-4 relative">
                  <div className="absolute top-0 bottom-0 left-1/2 border-l border-slate-300 dark:border-slate-800 pointer-events-none" />
                  <div className="absolute left-0 right-0 top-1/2 border-t border-slate-300 dark:border-slate-800 pointer-events-none" />
                  
                  {/* Visual drill cutout circle */}
                  <div className="h-20 w-20 rounded-full border-2 border-primary bg-primary/5 animate-pulse z-10 flex items-center justify-center shadow-lg shadow-primary/5">
                    <span className="text-[10px] font-bold text-primary font-mono">{specs.cutout_size}</span>
                  </div>
                  <span className="absolute bottom-2 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">{isRTL ? "قطر فتحة الحفر" : "Drill Cutout Diameter"}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed text-left">
                  {isRTL 
                    ? "تنبيه: مقاس القص الحقيقي لهذا المنتج هو الموضح أعلاه. يرجى قطع الفتحة في سقف الجبس بدقة متناهية ±2 مم لضمان تثبيت شفة الكشاف الجانبية بشكل متين ومستوٍ."
                    : "Note: The exact cut diameter is specified above. Please ensure your drywall installer tracks this dimension exactly ±2mm to guarantee a flush, high-end look."}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Buying info & RFQ */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1 inline-block mb-3">
                QUALITY LIGHT SHOWROOM
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
                {name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1.5 font-mono">
                {displayProduct.sku && <span>SKU: {displayProduct.sku}</span>}
              </div>
            </div>

            {/* Price section */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  {isRTL ? "السعر الكلي للمنتج" : "Total Product Price"}
                </span>
                <div className="flex items-baseline gap-2">
                  {onRequest ? (
                    <span className="text-2xl font-extrabold text-emerald-600">{isRTL ? 'السعر عند الطلب' : 'Price on request'}</span>
                  ) : (
                  <span className="text-3xl font-extrabold text-primary">
                    {finalPrice.toFixed(3)} <span className="text-sm font-semibold">{t('currency', 'KWD')}</span>
                  </span>
                  )}
                  {!onRequest && originalPrice && (
                    <span className="text-sm text-muted-foreground line-through font-normal">
                      {originalPrice.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold rounded-xl px-3 py-2 text-sm">
                  {isRTL ? `خصم ${discount}%` : `Save ${discount}%`}
                </div>
              )}
            </div>

            {/* Recommended Applications icons list */}
            {recommendedApps.length > 0 && (
            <div className="flex items-center gap-3 bg-muted/40 p-3.5 rounded-xl border text-xs">
              <span className="font-bold text-slate-500 shrink-0">{isRTL ? "تطبيقات مقترحة:" : "Best Applied in:"}</span>
              <div className="flex flex-wrap gap-2">
                {recommendedApps.map((app, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-slate-200/50 dark:bg-slate-800 text-[10px] px-2.5 py-0.5 rounded-md font-semibold text-muted-foreground">
                    {app}
                  </Badge>
                ))}
              </div>
            </div>
            )}

            {/* Short description */}
            {shortDescription && (
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {shortDescription}
              </p>
            )}

            {/* Variations dropdown Selector */}
            {displayVariations.length > 0 && (
              <div className="space-y-3 bg-muted/20 border p-4.5 rounded-2xl">
                <label className="text-xs font-bold text-foreground block">
                  {isRTL ? "حدد الحجم / القدرة بالواط" : "Select Size / Wattage"}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {displayVariations.map((v) => (
                    <Button
                      key={v.id}
                      variant={selectedVariation?.id === v.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariation(v)}
                      disabled={!v.stock_quantity || v.stock_quantity <= 0}
                      className="rounded-xl font-bold text-xs h-9 px-4"
                    >
                      {v.size || v.wattage || (language === 'ar' ? v.name_ar : v.name_en)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${inStock ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
              <span className={`text-xs font-bold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock 
                  ? (isRTL ? 'متوفر للطلب' : 'Available to order')
                  : (isRTL ? "غير متوفر حالياً" : "Out of Stock")}
              </span>
            </div>

            {/* Quantities, Add-to-cart, Wishlist, WhatsApp */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-border rounded-2xl bg-card p-1 self-start sm:self-auto shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-xl"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-10 text-center font-bold text-sm font-mono">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                    disabled={quantity >= stockQuantity}
                    className="h-10 w-10 rounded-xl"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Add to Cart button (price-on-request items are ordered through WhatsApp) */}
                <Button 
                  className={`flex-1 rounded-2xl font-bold text-sm h-12 shadow-lg hover:shadow-primary/10 gap-2 ${onRequest ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`} 
                  size="lg" 
                  disabled={!onRequest && (!inStock || isAddingToCart)}
                  onClick={onRequest ? handleWhatsAppOrder : handleAddToCart}
                >
                  {isAddingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 fill-black/5" />
                  )}
                  <span>{onRequest ? (isRTL ? 'اطلب السعر عبر واتساب' : 'Ask for price on WhatsApp') : (isRTL ? "أضف لعربة التسوق" : "Add to Shopping Cart")}</span>
                </Button>
                
                {/* Wishlist toggle */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleToggleWishlist}
                  className="rounded-2xl h-12 w-12 p-0 border-border/80 hover:border-slate-400 shrink-0"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
                </Button>
              </div>

              {/* Primary Contact Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Quick Inquiry */}
                <Button
                  variant="outline"
                  onClick={handleWhatsAppOrder}
                  className="rounded-2xl border-emerald-600/30 hover:border-emerald-600 text-emerald-600 hover:text-emerald-700 bg-emerald-600/5 hover:bg-emerald-600/10 font-bold text-xs sm:text-sm h-12 gap-2"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>{isRTL ? "استفسار واتساب سريع" : "WhatsApp Inquiry"}</span>
                </Button>

                {/* Real quotation flow: opens the instant quote page with this product */}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-amber-600/30 hover:border-amber-600 text-amber-500 hover:text-amber-600 bg-amber-500/5 hover:bg-amber-500/10 font-bold text-xs sm:text-sm h-12 gap-2"
                >
                  <Link to={`/quote?sku=${encodeURIComponent(displayProduct.sku || "")}&qty=${quantity}`}>
                    <Building2 className="h-4.5 w-4.5" />
                    <span>{isRTL ? "اطلب عرض سعر رسمي" : "Request a quotation"}</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Standard trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t text-center">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-1 text-primary shadow-inner">
                  <Truck className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold text-foreground">{isRTL ? 'توصيل لكل الكويت' : 'Delivery Across Kuwait'}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{isRTL ? 'مع خيار التوصيل في نفس اليوم' : 'Same-day option available'}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-1 text-primary shadow-inner">
                  <Shield className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold text-foreground">{isRTL ? 'معرضنا في حولي' : 'Showroom in Hawalli'}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{isRTL ? 'شارع تونس' : 'Tunis Street'}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-1 text-primary shadow-inner">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold text-foreground">{t('product.easyReturns', 'Easy Returns')}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{isRTL ? "خلال 14 يوماً" : "Within 14 Days"}</p>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM TABS: Description, Technical Specs Table, and Reviews */}
        <div className="mt-16 md:mt-20">
          <Tabs defaultValue="specifications" className="w-full bg-card border rounded-3xl p-6 md:p-10 shadow-sm">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 gap-5 md:gap-8 mb-6">
              <TabsTrigger value="specifications" className="rounded-none bg-transparent text-sm md:text-base font-bold pb-3 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">
                {t('product.specifications', 'Specifications')}
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-none bg-transparent text-sm md:text-base font-bold pb-3 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">
                {t('product.description', 'Description')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none bg-transparent text-sm md:text-base font-bold pb-3 px-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary">
                {t('product.reviews', 'Reviews')}{productReviews.length > 0 ? ` (${productReviews.length})` : ''}
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Specs Table: only values we actually know for this product */}
            <TabsContent value="specifications" className="mt-0">
              {specRows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs md:text-sm">
                  {specRows.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-border/80">
                      <span className="font-bold text-slate-500">{label}</span>
                      <span className="text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {isRTL ? 'للمواصفات الفنية التفصيلية، تواصل معنا عبر واتساب.' : 'For detailed technical specifications, contact us on WhatsApp.'}
                </p>
              )}
            </TabsContent>

            {/* TAB 2: Description */}
            <TabsContent value="description" className="mt-0">
              <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed text-slate-600 dark:text-slate-400">
                <p className="text-sm md:text-base">{description}</p>
              </div>
            </TabsContent>

            {/* TAB 3: Reviews */}
            <TabsContent value="reviews" className="mt-0 py-6">
              {product && <ProductReviews productId={product.id} />}
            </TabsContent>
          </Tabs>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-8 text-center md:text-left">
              {isRTL ? "منتجات ذات صلة قد تعجبك" : "Related Premium Lighting"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}

      </div>
    </StorefrontLayout>
  );
};

export default ProductDetail;
