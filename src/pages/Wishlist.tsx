import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { resolveImageUrl } from '@/lib/image-resolver';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

const Wishlist = () => {
  const { isRTL: seoAr } = useLanguage();
  useSEO({ title: seoAr ? "المفضلة" : "Wishlist", description: '', noindex: true });
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { items, toggleWishlist, isLoading } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addItem(item.id, 1);
      const name = isRTL && item.name_ar ? item.name_ar : item.name_en;
      toast.success(t('cart.itemAdded', 'Added to cart!'), {
        description: name,
      });
    } catch (error) {
      toast.error(t('cart.addError', 'Failed to add to cart'));
    }
  };

  const handleRemove = async (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(item);
    toast.success(t('wishlist.removed', 'Removed from wishlist!'));
  };

  return (
    <StorefrontLayout>
      {/* Page Header */}
      <div className="bg-muted/30 py-8">
        <div className="container">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">{t('nav.home', 'Home')}</Link>
            <span className="mx-2">/</span>
            <span>{t('wishlist.title', 'Wishlist')}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">
            {t('wishlist.title', 'Wishlist')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {!isLoading && t('wishlist.itemCount', '{{count}} items', { count: items.length })}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const name = isRTL && item.name_ar ? item.name_ar : item.name_en;
              const primaryImageUrl = resolveImageUrl(item.image_url, 'product', item.slug);
              
              return (
                <Card key={item.id} className="group overflow-hidden">
                  <Link to={`/product/${item.slug}`}>
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      {primaryImageUrl ? (
                        <img 
                          src={primaryImageUrl} 
                          alt={name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-355" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">💡</span>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemove(e, item)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-medium hover:text-primary transition-colors line-clamp-2 min-h-12 mb-2">
                        {name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-primary">
                        {(item.sale_price || item.base_price).toFixed(3)} {t('currency', 'KWD')}
                      </span>
                      {item.sale_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.base_price.toFixed(3)}
                        </span>
                      )}
                    </div>

                    <Button className="w-full" size="sm" onClick={(e) => handleAddToCart(e, item)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t('wishlist.addToCart', 'Add to Cart')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('wishlist.empty', 'Your wishlist is empty')}</h2>
            <p className="text-muted-foreground mb-6">{t('wishlist.emptyDescription', 'Save items you love for later.')}</p>
            <Button asChild>
              <Link to="/shop">{t('wishlist.startShopping', 'Browse Products')}</Link>
            </Button>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Wishlist;
