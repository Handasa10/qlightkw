import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { priceOf, searchCatalog, useCatalog } from '@/hooks/useCatalog';
import { DEPARTMENTS, departmentById, departmentOfCategory } from '@/lib/store-nav';

const PAGE_SIZE = 24;

type Sort = 'featured' | 'best' | 'newest' | 'price-low' | 'price-high' | 'name';

// Collection page: a department, a category, search results or offers.
// Everything the visitor chooses lives in the URL, so pages can be shared and the back button works.
const Shop = () => {
  const { isRTL } = useLanguage();
  const { products, categories, loading } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') || '';
  const categorySlug = params.get('category') || '';
  const dept = departmentById(params.get('dept')) || (categorySlug ? departmentOfCategory(categorySlug) : undefined);
  const offers = params.get('offers') === 'true';
  const pricedOnly = params.get('priced') === 'true';
  const sort = (params.get('sort') as Sort) || 'featured';
  const min = Number(params.get('min')) || 0;
  const max = Number(params.get('max')) || 0;

  const set = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const nameOf = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? (isRTL ? c.name_ar || c.name_en : c.name_en) : '';
  };
  const category = categories.find((c) => c.slug === categorySlug);
  const title = q
    ? (isRTL ? `نتائج البحث عن "${q}"` : `Search results for "${q}"`)
    : category ? nameOf(category.slug)
      : dept ? (isRTL ? dept.ar : dept.en)
        : offers ? (isRTL ? 'العروض' : 'Offers')
          : (isRTL ? 'جميع المنتجات' : 'All products');

  useSEO({
    title: category || dept
      ? (isRTL ? `${title} في الكويت | تسوق أونلاين` : `${title} in Kuwait | Shop Online`)
      : (isRTL ? 'تسوق الإضاءة والكهربائيات في الكويت' : 'Shop Lighting & Electrical Products in Kuwait'),
    description: isRTL
      ? `تسوق ${title} من كواليتي لايت: أسعار المعرض، توصيل لجميع مناطق الكويت والدفع عند الاستلام.`
      : `Shop ${title} at Quality Light: showroom prices, delivery across Kuwait and cash on delivery.`,
    params: { category: categorySlug || null, dept: !categorySlug && dept ? dept.id : null },
    // Search results and filtered views are thin duplicates of the collection pages
    noindex: !!q || offers || pricedOnly || !!min || !!max,
  });

  // Products of the chosen collection, before the sidebar filters
  const scoped = useMemo(() => {
    let list = q ? searchCatalog(products, q) : products;
    if (categorySlug) list = list.filter((p) => p.category_slug === categorySlug);
    else if (dept) list = list.filter((p) => p.category_slug && dept.categories.includes(p.category_slug));
    return list;
  }, [products, q, categorySlug, dept]);

  const filtered = useMemo(() => {
    let list = scoped;
    if (offers) list = list.filter((p) => p.sale_price && p.sale_price > 0 && p.sale_price < p.base_price);
    if (pricedOnly || min || max) list = list.filter((p) => priceOf(p) > 0);
    if (min) list = list.filter((p) => priceOf(p) >= min);
    if (max) list = list.filter((p) => priceOf(p) <= max);
    const name = (p: (typeof list)[number]) => (isRTL ? p.name_ar : p.name_en) || '';
    const sorted = [...list];
    switch (sort) {
      case 'price-low': sorted.sort((a, b) => (priceOf(a) || Infinity) - (priceOf(b) || Infinity)); break;
      case 'price-high': sorted.sort((a, b) => priceOf(b) - priceOf(a)); break;
      case 'name': sorted.sort((a, b) => name(a).localeCompare(name(b), isRTL ? 'ar' : 'en')); break;
      case 'newest': sorted.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')); break;
      case 'best': sorted.sort((a, b) => Number(!!b.is_bestseller) - Number(!!a.is_bestseller)); break;
      default:
        // Featured: proper photos and priced items first, then best sellers
        sorted.sort((a, b) => Number(a.stock_photo) - Number(b.stock_photo) || Number(priceOf(b) > 0) - Number(priceOf(a) > 0) || Number(!!b.is_bestseller) - Number(!!a.is_bestseller));
    }
    return sorted;
  }, [scoped, offers, pricedOnly, min, max, sort, isRTL]);

  useEffect(() => { setShown(PAGE_SIZE); }, [q, categorySlug, dept?.id, offers, pricedOnly, min, max, sort]);

  // Sub-collections shown as picture tiles: a department's categories, or all departments
  const tiles = useMemo(() => {
    if (q || offers) return [];
    const pictureFor = (slugs: string[]) => {
      const own = products.filter((p) => p.category_slug && slugs.includes(p.category_slug));
      return { image: (own.find((p) => !p.stock_photo) || own[0])?.image_url || null, count: own.length };
    };
    if (dept) {
      return dept.categories.map((slug) => ({ key: slug, label: nameOf(slug), href: `/shop?category=${slug}`, active: slug === categorySlug, ...pictureFor([slug]) }))
        .filter((t) => t.count > 0 && t.label);
    }
    return DEPARTMENTS.map((d) => ({ key: d.id, label: isRTL ? d.ar : d.en, href: `/shop?dept=${d.id}`, active: false, ...pictureFor(d.categories) })).filter((t) => t.count > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categories, dept, categorySlug, q, offers, isRTL]);

  const activeFilters = Number(offers) + Number(pricedOnly) + Number(!!min) + Number(!!max);

  const Filters = () => (
    <div className="space-y-1">
      <FilterGroup title={isRTL ? 'التوفر' : 'Availability'}>
        <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
          <input type="checkbox" checked={pricedOnly} onChange={(e) => set({ priced: e.target.checked ? 'true' : null })} className="h-4 w-4 accent-neutral-900" />
          {isRTL ? 'متاح للشراء المباشر (بسعر)' : 'Buy online now (priced)'}
        </label>
        <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
          <input type="checkbox" checked={offers} onChange={(e) => set({ offers: e.target.checked ? 'true' : null })} className="h-4 w-4 accent-neutral-900" />
          {isRTL ? 'العروض فقط' : 'On offer only'}
        </label>
      </FilterGroup>
      <FilterGroup title={isRTL ? 'السعر (د.ك)' : 'Price (KD)'}>
        <div className="flex items-center gap-2">
          <input type="number" min={0} inputMode="decimal" placeholder={isRTL ? 'من' : 'From'} defaultValue={min || ''} key={`min-${min}`}
            onBlur={(e) => set({ min: Number(e.target.value) > 0 ? e.target.value : null })}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" />
          <span className="text-neutral-400">–</span>
          <input type="number" min={0} inputMode="decimal" placeholder={isRTL ? 'إلى' : 'To'} defaultValue={max || ''} key={`max-${max}`}
            onBlur={(e) => set({ max: Number(e.target.value) > 0 ? e.target.value : null })}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" />
        </div>
      </FilterGroup>
      {dept && (
        <FilterGroup title={isRTL ? 'الفئة' : 'Category'}>
          <Link to={`/shop?dept=${dept.id}`} className={`block py-1.5 text-sm ${!categorySlug ? 'font-bold text-neutral-900' : 'text-neutral-600 hover:text-primary'}`}>{isRTL ? 'الكل' : 'All'}</Link>
          {dept.categories.filter(nameOf).map((slug) => (
            <Link key={slug} to={`/shop?category=${slug}`} className={`block py-1.5 text-sm ${slug === categorySlug ? 'font-bold text-neutral-900' : 'text-neutral-600 hover:text-primary'}`}>{nameOf(slug)}</Link>
          ))}
        </FilterGroup>
      )}
      {activeFilters > 0 && (
        <button type="button" onClick={() => set({ offers: null, priced: null, min: null, max: null })} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary">
          <X className="h-4 w-4" />{isRTL ? 'مسح الفلاتر' : 'Clear filters'}
        </button>
      )}
    </div>
  );

  return (
    <StorefrontLayout>
      <div className="container py-6 md:py-8">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <Link to="/" className="hover:text-primary">{isRTL ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          {dept || category || q || offers ? <Link to="/shop" className="hover:text-primary">{isRTL ? 'المتجر' : 'Shop'}</Link> : <span className="text-neutral-900">{isRTL ? 'المتجر' : 'Shop'}</span>}
          {dept && (<><span>/</span>{category ? <Link to={`/shop?dept=${dept.id}`} className="hover:text-primary">{isRTL ? dept.ar : dept.en}</Link> : <span className="text-neutral-900">{isRTL ? dept.ar : dept.en}</span>}</>)}
          {category && (<><span>/</span><span className="text-neutral-900">{nameOf(category.slug)}</span></>)}
        </nav>

        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">{title}</h1>

        {tiles.length > 1 && (
          <div className="-mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:gap-4 md:px-0 [&::-webkit-scrollbar]:hidden">
            {tiles.map((t) => (
              <Link key={t.key} to={t.href} className="group w-28 shrink-0 md:w-36">
                <div className={`aspect-square overflow-hidden rounded-2xl bg-[#f5f5f6] ring-2 ring-offset-2 transition ${t.active ? 'ring-neutral-900' : 'ring-transparent'}`}>
                  {t.image && <img src={t.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                </div>
                <p className={`mt-2 text-center text-xs font-semibold md:text-sm ${t.active ? 'text-primary' : 'text-neutral-800 group-hover:text-primary'}`}>{t.label}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-10">
          <aside className="hidden w-60 shrink-0 lg:block"><div className="sticky top-48"><Filters /></div></aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-3">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <button type="button" className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold lg:hidden">
                      <SlidersHorizontal className="h-4 w-4" />{isRTL ? 'الفلاتر' : 'Filters'}{activeFilters > 0 && ` (${activeFilters})`}
                    </button>
                  </SheetTrigger>
                  <SheetContent side={isRTL ? 'right' : 'left'} className="w-[85vw] max-w-sm overflow-y-auto bg-white text-neutral-900"><div className="pt-8"><Filters /></div></SheetContent>
                </Sheet>
                <p className="text-sm text-neutral-500">{loading ? '…' : isRTL ? `${filtered.length} منتج` : `${filtered.length} products`}</p>
              </div>
              <label className="relative flex items-center text-sm">
                <span className="me-2 hidden text-neutral-500 sm:inline">{isRTL ? 'ترتيب حسب' : 'Sort by'}</span>
                <select value={sort} onChange={(e) => set({ sort: e.target.value === 'featured' ? null : e.target.value })}
                  className="h-10 appearance-none rounded-full border border-neutral-300 bg-white pe-9 ps-4 text-sm font-semibold outline-none focus:border-neutral-900">
                  <option value="featured">{isRTL ? 'المميزة' : 'Featured'}</option>
                  <option value="best">{isRTL ? 'الأكثر مبيعاً' : 'Best selling'}</option>
                  <option value="newest">{isRTL ? 'الأحدث' : 'Newest'}</option>
                  <option value="price-low">{isRTL ? 'السعر: من الأقل' : 'Price: low to high'}</option>
                  <option value="price-high">{isRTL ? 'السعر: من الأعلى' : 'Price: high to low'}</option>
                  <option value="name">{isRTL ? 'الاسم' : 'Name'}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 h-4 w-4 text-neutral-500" />
              </label>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}><div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" /><div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-neutral-100" /></div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl bg-[#f5f5f6] px-6 py-16 text-center">
                <p className="text-lg font-bold text-neutral-900">{isRTL ? 'لا توجد منتجات مطابقة' : 'No products match'}</p>
                <p className="mt-2 text-sm text-neutral-600">{isRTL ? 'جرّب كلمات أقل أو امسح الفلاتر، أو اسألنا عبر واتساب.' : 'Try fewer words or clear the filters, or ask us on WhatsApp.'}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/shop" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary">{isRTL ? 'كل المنتجات' : 'All products'}</Link>
                  <a href="https://wa.me/96551111725" target="_blank" rel="noopener noreferrer" className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold hover:border-neutral-900">WhatsApp</a>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
                  {filtered.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                {shown < filtered.length && (
                  <div className="mt-10 text-center">
                    <p className="mb-3 text-xs text-neutral-500">{isRTL ? `عرض ${Math.min(shown, filtered.length)} من ${filtered.length}` : `Showing ${Math.min(shown, filtered.length)} of ${filtered.length}`}</p>
                    <button type="button" onClick={() => setShown((n) => n + PAGE_SIZE)} className="rounded-full border-2 border-neutral-900 px-8 py-3 text-sm font-bold text-neutral-900 transition hover:bg-neutral-900 hover:text-white">
                      {isRTL ? 'عرض المزيد' : 'Load more'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-neutral-200 py-4 first:pt-0">
    <h3 className="mb-2 text-sm font-bold text-neutral-900">{title}</h3>
    {children}
  </div>
);

export default Shop;
