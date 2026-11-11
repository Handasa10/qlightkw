import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Menu, MessageCircle, Search, ShoppingBag, Truck, User, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { priceOf, searchCatalog, useCatalog } from '@/hooks/useCatalog';
import { DEPARTMENTS } from '@/lib/store-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import logo from '@/assets/logo.png';
import MiniCartPreview from './MiniCartPreview';

// Store header: announcement bar, logo + search + account/wishlist/cart, department menu
const Header = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { products, categories } = useCatalog();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDept, setOpenDept] = useState<string | null>(null);
  const [mobileDept, setMobileDept] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when the page changes
  useEffect(() => { setSearchOpen(false); setOpenDept(null); setMenuOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.slug, isRTL ? c.name_ar || c.name_en : c.name_en]));
    return (slug: string) => map.get(slug);
  }, [categories, isRTL]);

  const suggestions = useMemo(() => (query.trim().length >= 2 ? searchCatalog(products, query).slice(0, 6) : []), [products, query]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const searchBox = (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={submitSearch} role="search">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder={isRTL ? 'ابحث عن منتج: بلاك، سبوت لايت، GU10…' : 'Search products: socket, spotlight, GU10…'}
          aria-label={isRTL ? 'بحث' : 'Search'}
          className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 ps-11 pe-4 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
        />
      </form>
      {searchOpen && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
          {suggestions.length === 0 ? (
            <p className="p-4 text-center text-sm text-neutral-500">{isRTL ? 'لا توجد نتائج' : 'No results'}</p>
          ) : (
            <>
              {suggestions.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">{isRTL ? p.name_ar : p.name_en}</span>
                  <span className="shrink-0 text-sm font-bold text-neutral-900">
                    {priceOf(p) > 0 ? `${priceOf(p).toFixed(3)} ${isRTL ? 'د.ك' : 'KD'}` : (isRTL ? 'اطلب السعر' : 'Ask price')}
                  </span>
                </Link>
              ))}
              <button type="button" onClick={submitSearch} className="w-full border-t border-neutral-100 px-4 py-3 text-sm font-semibold text-primary hover:bg-neutral-50">
                {isRTL ? `عرض كل النتائج لـ "${query.trim()}"` : `See all results for "${query.trim()}"`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  const badge = (n: number) => n > 0 && (
    <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{n > 99 ? '99+' : n}</span>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-white text-neutral-900">
      {/* Announcement bar */}
      <div className="bg-neutral-900 text-white">
        <div className="container flex h-9 items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-2 truncate">
            <Truck className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{isRTL ? 'توصيل لجميع مناطق الكويت · الدفع عند الاستلام' : 'Delivery across Kuwait · Cash on delivery'}</span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <a href="https://wa.me/96551111725" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 hover:text-primary sm:flex">
              <MessageCircle className="h-3.5 w-3.5" /><span dir="ltr">+965 5111 1725</span>
            </a>
            <button type="button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="font-semibold hover:text-primary">
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Logo, search, account, wishlist, cart */}
      <header className="border-b border-neutral-200">
        <div className="container flex h-16 items-center gap-3 md:h-20 md:gap-8">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button type="button" className="-ms-2 p-2 lg:hidden" aria-label={isRTL ? 'القائمة' : 'Menu'}><Menu className="h-6 w-6" /></button>
            </SheetTrigger>
            <SheetContent side={isRTL ? 'right' : 'left'} className="w-[85vw] max-w-sm overflow-y-auto bg-white p-0 text-neutral-900">
              <div className="border-b border-neutral-200 p-5"><img src={logo} alt="Quality Light" className="h-9 w-auto" /></div>
              <nav className="p-2">
                {DEPARTMENTS.map((d) => (
                  <div key={d.id} className="border-b border-neutral-100">
                    <button type="button" onClick={() => setMobileDept(mobileDept === d.id ? null : d.id)} className="flex w-full items-center justify-between px-3 py-3.5 text-start text-[15px] font-semibold">
                      {isRTL ? d.ar : d.en}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileDept === d.id ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDept === d.id && (
                      <div className="pb-3 ps-5">
                        <Link to={`/shop?dept=${d.id}`} className="block py-2 text-sm font-semibold text-primary">{isRTL ? 'عرض الكل' : 'Shop all'}</Link>
                        {d.categories.filter(categoryName).map((slug) => (
                          <Link key={slug} to={`/shop?category=${slug}`} className="block py-2 text-sm text-neutral-600">{categoryName(slug)}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link to="/shop?offers=true" className="block px-3 py-3.5 text-[15px] font-semibold text-red-600">{isRTL ? 'العروض' : 'Offers'}</Link>
                <Link to="/quote" className="block px-3 py-3.5 text-[15px] font-semibold">{isRTL ? 'عرض سعر فوري' : 'Instant quotation'}</Link>
                <Link to={user ? '/account' : '/auth'} className="block px-3 py-3.5 text-[15px] font-semibold">{user ? (isRTL ? 'حسابي' : 'My account') : (isRTL ? 'تسجيل الدخول' : 'Sign in')}</Link>
                <Link to="/contact" className="block px-3 py-3.5 text-[15px] font-semibold">{isRTL ? 'اتصل بنا' : 'Contact us'}</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="shrink-0" aria-label="Quality Light"><img src={logo} alt="Quality Light" className="h-9 w-auto md:h-11" /></Link>

          <div className="hidden flex-1 md:block">{searchBox}</div>

          <div className="ms-auto flex items-center gap-1 md:ms-0 md:gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="rounded-full p-2 hover:bg-neutral-100" aria-label={isRTL ? 'حسابي' : 'Account'}><User className="h-[22px] w-[22px]" /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white text-neutral-900">
                  <DropdownMenuItem asChild><Link to="/account">{isRTL ? 'حسابي' : 'My account'}</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/account/orders">{isRTL ? 'طلباتي' : 'My orders'}</Link></DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem asChild><Link to="/admin" className="font-semibold text-primary">{isRTL ? 'لوحة التحكم' : 'Admin dashboard'}</Link></DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="rounded-full p-2 hover:bg-neutral-100" aria-label={isRTL ? 'تسجيل الدخول' : 'Sign in'}><User className="h-[22px] w-[22px]" /></Link>
            )}
            <Link to="/wishlist" className="relative hidden rounded-full p-2 hover:bg-neutral-100 sm:block" aria-label={isRTL ? 'المفضلة' : 'Wishlist'}>
              <Heart className="h-[22px] w-[22px]" />{badge(wishlistCount)}
            </Link>
            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger asChild>
                <Link to="/cart" className="relative flex items-center gap-2 rounded-full p-2 hover:bg-neutral-100" aria-label={isRTL ? 'السلة' : 'Cart'}>
                  <span className="relative"><ShoppingBag className="h-[22px] w-[22px]" />{badge(itemCount)}</span>
                  <span className="hidden text-sm font-semibold lg:inline">{isRTL ? 'السلة' : 'Cart'}</span>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent align="end" sideOffset={8} className="hidden w-auto rounded-2xl border-neutral-200 bg-white p-4 text-neutral-900 shadow-xl sm:block">
                <MiniCartPreview />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <div className="container pb-3 md:hidden">{searchBox}</div>
      </header>

      {/* Department menu */}
      <nav className="hidden border-b border-neutral-200 lg:block" onMouseLeave={() => setOpenDept(null)}>
        <div className="container relative">
          <ul className="flex items-center gap-5 whitespace-nowrap text-[13px] font-semibold xl:gap-7 xl:text-sm">
            {DEPARTMENTS.map((d) => (
              <li key={d.id} onMouseEnter={() => setOpenDept(d.id)}>
                <Link to={`/shop?dept=${d.id}`} className={`flex h-12 items-center gap-1 border-b-2 transition-colors ${openDept === d.id ? 'border-primary text-primary' : 'border-transparent hover:text-primary'}`}>
                  {isRTL ? d.ar : d.en}
                  {d.categories.length > 1 && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
              </li>
            ))}
            <li onMouseEnter={() => setOpenDept(null)}><Link to="/shop?offers=true" className="flex h-12 items-center text-red-600 hover:text-red-700">{isRTL ? 'العروض' : 'Offers'}</Link></li>
            <li className="ms-auto hidden xl:block" onMouseEnter={() => setOpenDept(null)}><Link to="/quote" className="flex h-12 items-center text-neutral-500 hover:text-primary">{isRTL ? 'عرض سعر فوري' : 'Instant quotation'}</Link></li>
          </ul>
          {DEPARTMENTS.filter((d) => d.id === openDept && d.categories.length > 1).map((d) => (
            <div key={d.id} className="absolute inset-x-0 top-full z-40 rounded-b-2xl border border-t-0 border-neutral-200 bg-white p-6 shadow-xl">
              <div className="grid grid-cols-4 gap-x-8 gap-y-1">
                <Link to={`/shop?dept=${d.id}`} className="col-span-4 mb-2 text-base font-bold hover:text-primary">{isRTL ? `كل ${d.ar}` : `All ${d.en}`}</Link>
                {d.categories.filter(categoryName).map((slug) => (
                  <Link key={slug} to={`/shop?category=${slug}`} className="rounded-lg py-2 text-sm font-medium text-neutral-600 hover:text-primary">{categoryName(slug)}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Header;
