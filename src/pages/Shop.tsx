import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import ProductCard from '@/components/storefront/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { parseProductSpecs } from '@/lib/spec-helper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { SlidersHorizontal, Grid3X3, List, Search, X, Tag } from 'lucide-react';
import { resolveImageUrl, resolveSecondaryImageUrl } from '@/lib/image-resolver';
import { useSEO } from '@/hooks/useSEO';

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
  category_id: string | null;
  brand_id: string | null;
  specifications?: Record<string, any> | null;
}

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  name_ar: string | null;
}

const PRODUCTS_PER_PAGE = 12;

const Shop = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Smart specifications filter states
  const [selectedWatts, setSelectedWatts] = useState<string[]>([]);
  const [selectedIPs, setSelectedIPs] = useState<string[]>([]);
  const [selectedCCTs, setSelectedCCTs] = useState<string[]>([]);
  const [offersOnly, setOffersOnly] = useState(searchParams.get('offers') === 'true');
  const seoCategory = categories.find((c) => c.slug === selectedCategory);
  const seoCategoryName = seoCategory ? (isRTL ? seoCategory.name_ar || seoCategory.name_en : seoCategory.name_en) : '';
  useSEO({
    title: seoCategoryName
      ? (isRTL ? `${seoCategoryName} في الكويت | تسوق أونلاين بأفضل الأسعار` : `${seoCategoryName} in Kuwait | Shop Online at the Best Prices`)
      : (isRTL ? 'تسوق جميع منتجات الإضاءة في الكويت' : 'Shop All Lighting Products in Kuwait'),
    description: seoCategoryName
      ? (isRTL
        ? `تسوق ${seoCategoryName} من كواليتي لايت: أسعار ممتازة، ضمان، وتوصيل سريع لجميع مناطق الكويت. معرضنا في حولي – شارع تونس.`
        : `Buy ${seoCategoryName} from Quality Light: great prices, warranty and fast delivery across Kuwait. Showroom in Hawalli, Tunis Street.`)
      : (isRTL
        ? 'أكثر من 120 منتج إضاءة: LED، ثريات، سبوت لايت، شرائط LED، إضاءة خارجية وذكية بتوصيل سريع في الكويت.'
        : 'Over 120 lighting products: LED, chandeliers, spotlights, LED strips, outdoor and smart lighting with fast delivery in Kuwait.'),
    params: { category: selectedCategory || null },
    // Search results and filtered views are thin duplicates of category pages
    noindex: !!searchParams.get('q') || offersOnly,
  });

  // Handle URL change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);

    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);

    const offers = searchParams.get('offers');
    if (offers === 'true') setOffersOnly(true);
  }, [searchParams]);

  // Load Filters & All Products once
  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          supabase.from('categories').select('id, name_en, name_ar, slug').eq('is_active', true),
          supabase.from('brands').select('id, name, name_ar').eq('is_active', true),
          supabase.from('products').select('id, name_en, name_ar, slug, base_price, sale_price, is_new, is_bestseller, is_featured, category_id, brand_id, specifications').eq('is_active', true)
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (brandsRes.data) setBrands(brandsRes.data);
        
        if (productsRes.data) {
          // Fetch product images
          const pIds = productsRes.data.map(p => p.id);
          if (pIds.length > 0) {
            const { data: images } = await supabase
              .from('product_images')
              .select('product_id, url, is_primary, sort_order')
              .in('product_id', pIds)
              .order('is_primary', { ascending: false })
              .order('sort_order', { ascending: true });

            const productsWithImages = productsRes.data.map(product => {
              const productImages = images?.filter(img => img.product_id === product.id) || [];
              const primaryImage = productImages.find(img => img.is_primary) || productImages[0];
              const secondaryImage = productImages.find(img => !img.is_primary && img.url !== primaryImage?.url) || productImages[1];
              
              return {
                ...product,
                image_url: resolveImageUrl(primaryImage?.url, 'product', product.slug),
                secondary_image_url: resolveSecondaryImageUrl(secondaryImage?.url, product.slug)
              };
            });
            setAllProducts(productsWithImages);
          } else {
            setAllProducts([]);
          }
        }
      } catch (err) {
        console.error("Error loading store catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, []);

  // Filter and sort items dynamically in memory
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name_en.toLowerCase().includes(q) || 
        p.name_ar.includes(q) || 
        p.slug.toLowerCase().includes(q)
      );
    }

    // 2. Category
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        result = result.filter(p => p.category_id === cat.id);
      }
    }

    // 3. Brand
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand_id && selectedBrands.includes(p.brand_id));
    }

    // 4. Price Range
    result = result.filter(p => {
      const price = p.sale_price || p.base_price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // 5. Offers Only
    if (offersOnly) {
      result = result.filter(p => p.sale_price !== null);
    }

    // 6. Wattage filtering
    if (selectedWatts.length > 0) {
      result = result.filter(p => {
        const specs = parseProductSpecs(p.specifications, p.slug, p.name_en);
        const w = specs.wattage.toLowerCase();
        return selectedWatts.some(target => w.includes(target.toLowerCase()));
      });
    }

    // 7. IP Rating filtering
    if (selectedIPs.length > 0) {
      result = result.filter(p => {
        const specs = parseProductSpecs(p.specifications, p.slug, p.name_en);
        const ip = specs.ip_rating.toLowerCase();
        return selectedIPs.some(target => ip.includes(target.toLowerCase()));
      });
    }

    // 8. Color Temperature (CCT) filtering
    if (selectedCCTs.length > 0) {
      result = result.filter(p => {
        const specs = parseProductSpecs(p.specifications, p.slug, p.name_en);
        const cct = specs.cct.toLowerCase();
        return selectedCCTs.some(target => cct.includes(target.toLowerCase()));
      });
    }

    // 9. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
        break;
      case 'name':
        result.sort((a, b) => {
          const nameA = language === 'ar' ? a.name_ar : a.name_en;
          const nameB = language === 'ar' ? b.name_ar : b.name_en;
          return nameA.localeCompare(nameB);
        });
        break;
      default:
        // Newest / Featured
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, selectedBrands, priceRange, offersOnly, selectedWatts, selectedIPs, selectedCCTs, sortBy, categories, language]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, offersOnly, selectedWatts, selectedIPs, selectedCCTs, sortBy]);

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  const handleWattToggle = (watt: string) => {
    setSelectedWatts(prev =>
      prev.includes(watt) ? prev.filter(w => w !== watt) : [...prev, watt]
    );
  };

  const handleIPToggle = (ip: string) => {
    setSelectedIPs(prev =>
      prev.includes(ip) ? prev.filter(i => i !== ip) : [...prev, ip]
    );
  };

  const handleCCTToggle = (cct: string) => {
    setSelectedCCTs(prev =>
      prev.includes(cct) ? prev.filter(c => c !== cct) : [...prev, cct]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSortBy('newest');
    setSelectedWatts([]);
    setSelectedIPs([]);
    setSelectedCCTs([]);
    setOffersOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const paginatedProducts = useMemo(() => {
    const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const to = from + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(from, to);
  }, [filteredProducts, currentPage]);

  const FiltersContent = () => (
    <div className="space-y-6.5 p-1">
      {/* 1. Search Query */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "البحث بالاسم" : "Search Keyword"}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isRTL ? "اسم المنتج..." : "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30 rounded-xl text-xs h-10 border-border"
          />
        </div>
      </div>

      {/* 2. Offers Toggle */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{isRTL ? "عروض وحسومات خاصة" : "Special Offers Only"}</span>
        </div>
        <Checkbox
          checked={offersOnly}
          onCheckedChange={(checked) => setOffersOnly(!!checked)}
        />
      </div>

      {/* 3. Categories list */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "أقسام الإضاءة" : "Lighting Categories"}</h3>
        <div className="space-y-1">
          <Button
            variant={selectedCategory === '' ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-start rounded-xl text-xs h-9"
            onClick={() => setSelectedCategory('')}
          >
            {isRTL ? "جميع الأقسام" : "All Categories"}
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-start rounded-xl text-xs h-9"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {language === 'ar' ? category.name_ar : category.name_en}
            </Button>
          ))}
        </div>
      </div>

      {/* 4. Price Range */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "نطاق السعر (د.ك)" : "Price Range (KWD)"}</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500}
            step={5}
            className="mb-3.5 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{priceRange[0].toFixed(3)} د.ك</span>
            <span>{priceRange[1].toFixed(3)} د.ك</span>
          </div>
        </div>
      </div>

      {/* 5. Watts (Smart Specs Filter) */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "القدرة (واط)" : "Power (Wattage)"}</h3>
        <div className="grid grid-cols-2 gap-2">
          {['9W', '12W', '15W', '18W', '24W', '50W', '100W'].map(watt => (
            <label key={watt} className="flex items-center gap-2 cursor-pointer bg-muted/20 hover:bg-muted/40 p-2 rounded-xl border border-border/40 transition-colors">
              <Checkbox
                checked={selectedWatts.includes(watt)}
                onCheckedChange={() => handleWattToggle(watt)}
              />
              <span className="text-xs font-medium">{watt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. CCT Color Temperature */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "حرارة اللون (CCT)" : "Color Temp (CCT)"}</h3>
        <div className="space-y-2">
          {[
            { key: '3000K', label: isRTL ? '3000K (أصفر دافئ)' : '3000K (Warm White)' },
            { key: '4000K', label: isRTL ? '4000K (أبيض طبيعي)' : '4000K (Natural White)' },
            { key: '6000K', label: isRTL ? '6000K (نهاري بارد)' : '6000K (Cool White)' }
          ].map(c => (
            <label key={c.key} className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={selectedCCTs.includes(c.key)}
                onCheckedChange={() => handleCCTToggle(c.key)}
              />
              <span className="text-xs font-semibold">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 7. IP Protection */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "مقاومة الماء (IP)" : "IP Protection"}</h3>
        <div className="space-y-2">
          {[
            { key: 'IP20', label: isRTL ? 'IP20 (إضاءة داخلية)' : 'IP20 (Indoor/Dustproof)' },
            { key: 'IP44', label: isRTL ? 'IP44 (مقاوم للرطوبة)' : 'IP44 (Damp Location)' },
            { key: 'IP65', label: isRTL ? 'IP65 (خارجي مضاد للمطر)' : 'IP65 (Rainproof Outdoor)' },
            { key: 'IP66', label: isRTL ? 'IP66 (كشافات خارجية)' : 'IP66 (Weatherproof)' }
          ].map(ip => (
            <label key={ip.key} className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={selectedIPs.includes(ip.key)}
                onCheckedChange={() => handleIPToggle(ip.key)}
              />
              <span className="text-xs font-semibold">{ip.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 8. Brands */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">{isRTL ? "العلامات التجارية" : "Brands"}</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => handleBrandToggle(brand.id)}
              />
              <span className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                {language === 'ar' && brand.name_ar ? brand.name_ar : brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" className="w-full rounded-xl text-xs font-bold h-10 border-slate-300 dark:border-slate-800" onClick={clearFilters}>
        <X className="h-3.5 w-3.5 mr-2 shrink-0" />
        <span>{isRTL ? "إعادة تعيين الفلاتر" : "Clear Filters"}</span>
      </Button>
    </div>
  );

  return (
    <StorefrontLayout>
      {/* Page Header */}
      <div className="bg-muted/20 py-10 border-b border-border/50">
        <div className="container">
          <nav className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="mx-2">/</span>
            <span>{t('nav.products', 'Products')}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isRTL ? "معرض المنتجات الفاخرة" : "Shop All Products"}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-xl">
            {isRTL 
              ? "استعرض مجموعاتنا المتكاملة من حلول الإضاءة المعمارية والديكورية بأعلى مقاييس الجودة."
              : "Discover our comprehensive catalog of architectural, decorative, and commercial lighting fixtures."}
          </p>
        </div>
      </div>

      <div className="container py-10 md:py-16">
        <div className="flex gap-8">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 border border-border/80 rounded-2xl bg-card p-6 h-fit sticky top-24">
            <FiltersContent />
          </aside>

          {/* Products Column */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-8 bg-card border border-border/80 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Sheet Trigger */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden rounded-xl text-xs font-bold gap-1.5 h-9">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>{t('shop.filters', 'Filters')}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto bg-slate-900 border-slate-800 text-slate-100">
                    <div className="py-4">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground mr-1">{totalProducts}</span>
                  {isRTL ? "منتجات مطابقة" : "products found"}
                </p>
              </div>

              {/* Layout controls */}
              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 rounded-xl h-9 text-xs">
                    <SelectValue placeholder={t('shop.sortBy', 'Sort by')} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest" className="text-xs">{isRTL ? "أحدث الموديلات" : "Newest Arrivals"}</SelectItem>
                    <SelectItem value="price-low" className="text-xs">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</SelectItem>
                    <SelectItem value="price-high" className="text-xs">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</SelectItem>
                    <SelectItem value="name" className="text-xs">{isRTL ? "الترتيب بالاسم" : "Alphabetical"}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Grid Mode switch */}
                <div className="hidden sm:flex border rounded-xl overflow-hidden p-0.5 bg-muted/40 border-border">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="space-y-3.5 border border-border/80 rounded-2xl p-4">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center border-t border-border/50 pt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {getPageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-card border border-border/80 rounded-3xl p-8">
                <p className="text-muted-foreground text-sm mb-4">
                  {isRTL 
                    ? "لا توجد منتجات مطابقة لخيارات البحث المحددة." 
                    : "No products found matching the selected search criteria."}
                </p>
                <Button onClick={clearFilters} className="rounded-xl font-bold text-xs h-10 px-6">
                  {isRTL ? "إعادة تعيين الفلاتر" : "Reset All Filters"}
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </StorefrontLayout>
  );
};

export default Shop;
