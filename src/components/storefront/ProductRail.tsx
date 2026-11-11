import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CatalogProduct } from '@/hooks/useCatalog';
import ProductCard from './ProductCard';

interface ProductRailProps {
  title: string;
  products: CatalogProduct[];
  href?: string;
  loading?: boolean;
}

// A titled horizontal row of products with arrows and a "view all" link
const ProductRail = ({ title, products, href, loading }: ProductRailProps) => {
  const { isRTL } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  if (!loading && products.length === 0) return null;

  const scroll = (forward: boolean) => {
    const el = track.current;
    if (!el) return;
    const step = el.clientWidth * 0.8 * (forward ? 1 : -1) * (isRTL ? -1 : 1);
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  return (
    <section className="container py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {href && <Link to={href} className="me-2 text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-primary hover:underline">{isRTL ? 'عرض الكل' : 'View all'}</Link>}
          <button type="button" onClick={() => scroll(false)} aria-label={isRTL ? 'السابق' : 'Previous'} className="hidden h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:border-neutral-900 md:flex">
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => scroll(true)} aria-label={isRTL ? 'التالي' : 'Next'} className="hidden h-9 w-9 items-center justify-center rounded-full border border-neutral-200 hover:border-neutral-900 md:flex">
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div ref={track} className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:gap-5 md:px-0 [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[44vw] shrink-0 sm:w-56 lg:w-[calc((100%-5rem)/5)]">
              <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
            </div>
          ))
          : products.map((p) => (
            <div key={p.id} className="w-[44vw] shrink-0 snap-start sm:w-56 lg:w-[calc((100%-5rem)/5)]">
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </section>
  );
};

export default ProductRail;
