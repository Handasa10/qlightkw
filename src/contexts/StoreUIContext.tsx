import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { CatalogProduct } from '@/hooks/useCatalog';

// Shared store interactions: the slide-out cart, quick view, and the "fly to cart" animation
interface Flight { id: number; src: string; from: DOMRect; to: DOMRect }

interface StoreUI {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  lastAdded: CatalogProduct | null;
  quickView: CatalogProduct | null;
  setQuickView: (product: CatalogProduct | null) => void;
  // Call after adding to cart: flies the photo from `from` to the cart icon, then opens the cart
  celebrateAdd: (product: CatalogProduct | null, from?: Element | null, imageSrc?: string | null) => void;
  flights: Flight[];
  cartIconRef: React.MutableRefObject<HTMLElement | null>;
}

const Ctx = createContext<StoreUI | null>(null);

export function StoreUIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<CatalogProduct | null>(null);
  const [lastAdded, setLastAdded] = useState<CatalogProduct | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const cartIconRef = useRef<HTMLElement | null>(null);

  const celebrateAdd = useCallback((product: CatalogProduct | null, from?: Element | null, imageSrc?: string | null) => {
    setLastAdded(product);
    const target = cartIconRef.current?.getBoundingClientRect();
    const start = from?.getBoundingClientRect();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (start && target && imageSrc && !reduced && target.width > 0) {
      const id = Date.now() + Math.random();
      setFlights((f) => [...f, { id, src: imageSrc, from: start, to: target }]);
      setTimeout(() => {
        setFlights((f) => f.filter((x) => x.id !== id));
        setCartOpen(true);
      }, 750);
    } else {
      setCartOpen(true);
    }
  }, []);

  return (
    <Ctx.Provider value={{ cartOpen, setCartOpen, lastAdded, quickView, setQuickView, celebrateAdd, flights, cartIconRef }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStoreUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStoreUI must be used inside StoreUIProvider');
  return ctx;
}

// Optional variant for components that can also render outside the store layout
export function useStoreUIOptional() {
  return useContext(Ctx);
}
