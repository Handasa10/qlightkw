import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface WishlistProduct {
  id: string;
  wishlist_item_id?: string;
  name_en: string;
  name_ar: string | null;
  slug: string;
  base_price: number;
  sale_price: number | null;
  image_url: string | null;
  is_new?: boolean | null;
  is_bestseller?: boolean | null;
}

interface WishlistContextType {
  items: WishlistProduct[];
  isLoading: boolean;
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const wishlistCount = items.length;

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      fetchWishlistAndSync();
    } else {
      loadGuestWishlist();
    }
  }, [user]);

  const loadGuestWishlist = () => {
    setIsLoading(true);
    const saved = localStorage.getItem('guest_wishlist');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([]);
    }
    setIsLoading(false);
  };

  const saveGuestWishlist = (newItems: WishlistProduct[]) => {
    localStorage.setItem('guest_wishlist', JSON.stringify(newItems));
    setItems(newItems);
  };

  const fetchWishlistAndSync = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Get or create user's wishlist
      let { data: wishlist, error: fetchError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let currentWishlistId = wishlist?.id;

      if (!currentWishlistId && !fetchError) {
        const { data: newWishlist, error: createError } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id })
          .select('id')
          .single();

        if (newWishlist) {
          currentWishlistId = newWishlist.id;
        } else {
          console.error('Error creating wishlist:', createError);
        }
      }

      if (currentWishlistId) {
        setWishlistId(currentWishlistId);

        // 2. Sync guest items if any exist
        const guestSaved = localStorage.getItem('guest_wishlist');
        if (guestSaved) {
          const guestItems: WishlistProduct[] = JSON.parse(guestSaved);
          if (guestItems.length > 0) {
            // Fetch existing wishlist items to avoid duplicates
            const { data: existingDbItems } = await supabase
              .from('wishlist_items')
              .select('product_id')
              .eq('wishlist_id', currentWishlistId);

            const existingIds = new Set(existingDbItems?.map(item => item.product_id) || []);

            const itemsToInsert = guestItems
              .filter(item => !existingIds.has(item.id))
              .map(item => ({
                wishlist_id: currentWishlistId!,
                product_id: item.id,
              }));

            if (itemsToInsert.length > 0) {
              await supabase.from('wishlist_items').insert(itemsToInsert);
            }
            // Clear guest wishlist
            localStorage.removeItem('guest_wishlist');
          }
        }

        // 3. Fetch all current wishlist items
        await loadDbWishlist(currentWishlistId);
      }
    } catch (error) {
      console.error('Error syncing/fetching wishlist:', error);
    }
    setIsLoading(false);
  };

  const loadDbWishlist = async (wId: string) => {
    const { data: dbItems, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        products (
          id,
          name_en,
          name_ar,
          slug,
          base_price,
          sale_price,
          is_new,
          is_bestseller
        )
      `)
      .eq('wishlist_id', wId);

    if (error) {
      console.error('Error fetching wishlist items:', error);
      return;
    }

    if (dbItems) {
      const resolved = await Promise.all(
        dbItems.map(async (item: any) => {
          // Fetch primary image
          const { data: image } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', item.product_id)
            .eq('is_primary', true)
            .maybeSingle();

          return {
            id: item.products.id,
            wishlist_item_id: item.id,
            name_en: item.products.name_en,
            name_ar: item.products.name_ar,
            slug: item.products.slug,
            base_price: item.products.base_price,
            sale_price: item.products.sale_price,
            image_url: image?.url || null,
            is_new: item.products.is_new,
            is_bestseller: item.products.is_bestseller,
          };
        })
      );
      setItems(resolved);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.id === productId);
  };

  const toggleWishlist = async (product: any) => {
    const isCurrentlyWishlisted = isInWishlist(product.id);

    if (user) {
      // Authenticated toggle
      if (!wishlistId) return;

      if (isCurrentlyWishlisted) {
        const itemToRemove = items.find(item => item.id === product.id);
        if (itemToRemove?.wishlist_item_id) {
          const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('id', itemToRemove.wishlist_item_id);

          if (!error) {
            setItems(items.filter(item => item.id !== product.id));
          }
        }
      } else {
        const { data: newItem, error } = await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlistId,
            product_id: product.id,
          })
          .select('id')
          .single();

        if (!error && newItem) {
          // Fetch product primary image
          const { data: image } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', product.id)
            .eq('is_primary', true)
            .maybeSingle();

          const addedProduct: WishlistProduct = {
            id: product.id,
            wishlist_item_id: newItem.id,
            name_en: product.name_en,
            name_ar: product.name_ar,
            slug: product.slug,
            base_price: product.base_price,
            sale_price: product.sale_price,
            image_url: image?.url || product.image_url || null,
            is_new: product.is_new,
            is_bestseller: product.is_bestseller,
          };
          setItems([...items, addedProduct]);
        }
      }
    } else {
      // Guest toggle
      if (isCurrentlyWishlisted) {
        saveGuestWishlist(items.filter(item => item.id !== product.id));
      } else {
        // Fetch product primary image if not provided
        let imageUrl = product.image_url || null;
        if (!imageUrl) {
          const { data: image } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', product.id)
            .eq('is_primary', true)
            .maybeSingle();
          imageUrl = image?.url || null;
        }

        const addedProduct: WishlistProduct = {
          id: product.id,
          name_en: product.name_en,
          name_ar: product.name_ar,
          slug: product.slug,
          base_price: product.base_price,
          sale_price: product.sale_price,
          image_url: imageUrl,
          is_new: product.is_new,
          is_bestseller: product.is_bestseller,
        };
        saveGuestWishlist([...items, addedProduct]);
      }
    }
  };

  const refreshWishlist = async () => {
    if (user) {
      if (wishlistId) {
        await loadDbWishlist(wishlistId);
      } else {
        await fetchWishlistAndSync();
      }
    } else {
      loadGuestWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
