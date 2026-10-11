import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseProductSpecs } from '@/lib/spec-helper';
import { 
  Heart, 
  ShoppingCart, 
  Loader2, 
  MessageCircle, 
  Zap, 
  Lightbulb, 
  Sun, 
  Shield, 
  Maximize2, 
  Award 
} from 'lucide-react';
import { toast } from 'sonner';
import { resolveImageUrl, resolveSecondaryImageUrl } from '@/lib/image-resolver';
import { glowHandlers } from '@/components/effects/glow';

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
  specifications?: Record<string, any> | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product, index = 0 }, ref) => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [secondaryImgError, setSecondaryImgError] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const name = language === 'ar' ? product.name_ar : product.name_en;
  const price = product.sale_price || product.base_price;
  const originalPrice = product.sale_price ? product.base_price : null;
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // Retrieve technical specifications using helper fallbacks
  const specs = parseProductSpecs(product.specifications, product.slug, product.name_en);

  // Check if there's a different secondary image
  const hasSecondaryImage = product.secondary_image_url && product.secondary_image_url !== product.image_url;
  
  // Resolve URLs
  const primaryImageUrl = resolveImageUrl(product.image_url, 'product', product.slug);
  const secondaryImageUrl = resolveSecondaryImageUrl(product.secondary_image_url, product.slug);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addItem(product.id, 1);
      toast.success(t('cart.itemAdded', 'Added to cart!'), {
        description: name,
      });
    } catch (error) {
      toast.error(t('cart.addError', 'Failed to add to cart'));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product);
      if (isWishlisted) {
        toast.success(t('wishlist.removed', 'Removed from wishlist!'));
      } else {
        toast.success(t('wishlist.added', 'Added to wishlist!'));
      }
    } catch (error) {
      toast.error(t('wishlist.toggleError', 'Failed to update wishlist'));
    }
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = isRTL
      ? `السلام عليكم، أود الاستفسار عن منتج: *${name}*\nالسعر: ${price.toFixed(3)} د.ك\nالرابط: ${window.location.origin}/product/${product.slug}`
      : `Hello, I would like to inquire about the product: *${name}*\nPrice: ${price.toFixed(3)} KWD\nLink: ${window.location.origin}/product/${product.slug}`;

    const phoneNumber = '96551111725';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      ref={ref}
      className="group flex flex-col h-full"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="glow-card w-full flex flex-col flex-1 rounded-2xl overflow-hidden bg-card border border-border/80 shadow-sm hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.45)] transition-all duration-500"
        {...glowHandlers}
      >
        
        {/* Wishlist Floating Button */}
        <div className="absolute top-3 right-3 z-20">
          <Button
            size="icon"
            variant="secondary"
            className="h-8.5 w-8.5 rounded-full shadow-md backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-none hover:scale-110 transition-transform"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-slate-600 dark:text-slate-300'}`} />
          </Button>
        </div>

        {/* Badges Floating Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.is_new && (
            <Badge className="bg-green-600/90 text-white border-none text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {isRTL ? "جديد" : "New"}
            </Badge>
          )}
          {product.is_bestseller && (
            <Badge className="bg-primary/95 text-primary-foreground border-none text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {isRTL ? "الأكثر مبيعاً" : "Bestseller"}
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="border-none text-[10px] px-2 py-0.5 rounded-md font-bold">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Image Frame */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-[4/4] overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
          {/* Primary Image */}
          {primaryImageUrl && !imgError ? (
            <img
              src={primaryImageUrl}
              alt={name}
              onError={() => setImgError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && hasSecondaryImage && !secondaryImgError ? 'opacity-0 scale-105' : 'opacity-100'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-4xl">💡</span>
            </div>
          )}
          
          {/* Secondary Image on Hover */}
          {hasSecondaryImage && secondaryImageUrl && !secondaryImgError && (
            <img
              src={secondaryImageUrl}
              alt={`${name} - alternate`}
              onError={() => setSecondaryImgError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}

          {/* Sweep of light across the photo on hover */}
          <div
            className={`absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out ${
              isHovered ? 'translate-x-[300%]' : 'translate-x-0'
            }`}
          />
        </Link>

        {/* Product Details Section */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-4">
          
          <div>
            {/* Title & Brand */}
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-bold text-xs md:text-sm text-foreground line-clamp-2 hover:text-primary transition-colors leading-tight mb-1">
                {name}
              </h3>
            </Link>
            
            {/* Price section */}
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-base font-extrabold text-primary">
                {price.toFixed(3)} <span className="text-[10px] font-normal">{t('currency', 'KWD')}</span>
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through font-normal">
                  {originalPrice.toFixed(3)}
                </span>
              )}
            </div>

            {/* TECHNICAL SPECIFICATIONS GRID (CRITICAL REQUIREMENT) */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/50 pt-3 mt-3 text-[10px] text-muted-foreground">
              {/* Wattage */}
              <div className="flex items-center gap-1.5 min-w-0" title="Wattage">
                <Zap className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                <span className="truncate font-medium">{specs.wattage}</span>
              </div>
              {/* Lumens */}
              <div className="flex items-center gap-1.5 min-w-0" title="Lumens">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                <span className="truncate font-medium">{specs.lumens}</span>
              </div>
              {/* Color Temp (CCT) */}
              <div className="flex items-center gap-1.5 min-w-0" title="Color Temperature">
                <Sun className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                <span className="truncate font-medium">{specs.cct.split(' ')[0]}</span>
              </div>
              {/* IP Rating */}
              <div className="flex items-center gap-1.5 min-w-0" title="IP Protection Rating">
                <Shield className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                <span className="truncate font-medium">{specs.ip_rating}</span>
              </div>
              {/* Cutout Size (only shown if applicable) */}
              {specs.cutout_size && !specs.cutout_size.toLowerCase().includes('n/a') && (
                <div className="flex items-center gap-1.5 min-w-0" title="Cutout Diameter">
                  <Maximize2 className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                  <span className="truncate font-medium">{specs.cutout_size}</span>
                </div>
              )}
              {/* Warranty */}
              <div className="flex items-center gap-1.5 min-w-0" title="Warranty">
                <Award className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                <span className="truncate font-medium">{specs.warranty}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs (Add to Cart & WhatsApp Inquiry) - ALWAYS VISIBLE for Mobile Optimization */}
          <div className="flex flex-col gap-2 pt-1 border-t border-border/30">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full h-9 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-black shadow-sm gap-1.5"
            >
              {isAddingToCart ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>{isRTL ? "أضف للسلة" : "Add to Cart"}</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsAppOrder}
              className="w-full h-9 rounded-xl font-bold text-xs border-emerald-600/30 hover:border-emerald-600 text-emerald-600 bg-emerald-600/5 hover:bg-emerald-600/10 gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{isRTL ? "استفسار واتساب" : "WhatsApp Inquiry"}</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
