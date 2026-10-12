import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Moon,
  Sun,
  Globe,
  User,
  ShoppingCart,
  LogIn,
  Menu,
  Search,
  Heart,
  ChevronDown,
  X,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';
import MiniCartPreview from './MiniCartPreview';

const Header = () => {
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [promoIndex, setPromoIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';
  // Over the dark home hero the header is transparent with light text until the page scrolls
  const overHero = isHome && !scrolled && !isSearchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Promo ticker phrases
  const promos = [
    isRTL ? "توصيل مجاني في الكويت للطلبات الأكثر من 50 د.ك" : "Free delivery in Kuwait for orders over 50 KWD",
    isRTL ? "خصم يصل إلى 40٪ على الثريات الفاخرة" : "Up to 40% off on Premium Chandeliers",
    isRTL ? "استشارة مجانية لهندسة الإضاءة والمقاولين" : "Free lighting consultations for projects & contractors"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchVal.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const navLinks = [
    { href: '/', label: isRTL ? 'الرئيسية' : 'Home' },
    { href: '/shop', label: isRTL ? 'المتجر' : 'Shop' },
    { href: '/shop?offers=true', label: isRTL ? 'العروض' : 'Offers' },
    { href: '/projects', label: isRTL ? 'المشاريع' : 'Projects' },
    { href: '/about', label: isRTL ? 'من نحن' : 'About Us' },
    { href: '/contact', label: isRTL ? 'اتصل بنا' : 'Contact' },
  ];

  const categories = [
    { slug: 'led-spot-light', labelEn: 'Spotlights', labelAr: 'إضاءة سبوت لايت' },
    { slug: 'magnetic-light', labelEn: 'Magnetic Track Lights', labelAr: 'إضاءة مغناطيسية' },
    { slug: 'led-strip-light', labelEn: 'LED Strips', labelAr: 'شرائط LED' },
    { slug: 'led-panel-light', labelEn: 'Panel Lights', labelAr: 'إضاءة بانل' },
    { slug: 'switches-sockets', labelEn: 'Switches & Sockets', labelAr: 'مفاتيح وأفياش' },
    { slug: 'breakers-distribution', labelEn: 'Breakers & Boards', labelAr: 'قواطع ولوحات توزيع' },
    { slug: 'cables-wires', labelEn: 'Cables & Wires', labelAr: 'كابلات وأسلاك' },
    { slug: 'ceiling-general-lighting', labelEn: 'Ceiling Lighting', labelAr: 'إضاءة السقف' },
  ];

  return (
    <div className={`${isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0'} w-full z-50 flex flex-col`}>
      {/* 1. TOP BAR */}
      <div className={`w-full text-[#f8fafc] text-xs px-4 overflow-hidden transition-all duration-300 ${scrolled ? 'max-h-0 py-0 border-b-0' : 'max-h-24 py-2 border-b'} ${overHero ? 'bg-black/30 border-white/10 backdrop-blur-sm' : 'bg-[#0f172a] border-slate-800'}`}>
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contacts */}
          <div className="flex items-center gap-4 text-[11px] md:text-xs">
            <a href="tel:+96551111725" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span dir="ltr">+965 5111 1725</span>
            </a>
            <a 
              href="https://wa.me/96551111725" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="https://maps.google.com/?q=Tunis+Street,+Hawalli,+Kuwait" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{isRTL ? "حولي - شارع تونس" : "Hawalli - Tunis Street"}</span>
            </a>
          </div>

          {/* Promo Slider Ticker */}
          <div className="text-[11px] md:text-xs font-medium text-amber-400/90 text-center animate-pulse min-h-[16px]">
            {promos[promoIndex]}
          </div>

          {/* User Links / Actions */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] md:text-xs">
            <Link to="/shop?focus=contractor" className="hover:text-primary transition-colors font-medium border-b border-transparent hover:border-primary">
              {isRTL ? "بوابة المقاولين" : "Contractor Portal"}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className={`w-full border-b transition-all duration-500 ${overHero ? 'bg-transparent border-transparent text-white' : 'glass border-border shadow-sm backdrop-blur-md'}`}>
        <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2 shrink-0 ${isRTL ? 'order-last lg:order-none' : ''}`}>
            <AnimatedLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold ${overHero ? 'text-white/80' : 'text-muted-foreground'} hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`gap-1 font-semibold text-sm ${overHero ? 'text-white/80 hover:bg-white/10' : 'text-muted-foreground'} hover:text-primary h-auto py-1`}>
                  {isRTL ? "الأقسام" : "Categories"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-popover/95 backdrop-blur-md border border-border shadow-xl rounded-xl p-1.5">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild className="rounded-lg py-2">
                    <Link to={`/shop?category=${cat.slug}`}>
                      {isRTL ? cat.labelAr : cat.labelEn}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <Input
                type="search"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder={isRTL ? "ابحث عن الإضاءة (واط، لومن...)" : "Search by product, watt, lumen..."}
                className={`pl-10 pr-4 h-10 ${overHero ? 'bg-white/10 border-white/15 text-white placeholder:text-white/50 focus:text-foreground' : 'bg-muted/40 hover:bg-muted/70 border-border'} focus:bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-full transition-all text-xs`}
              />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className={`flex items-center gap-1.5 ${isRTL ? 'order-first lg:order-none' : ''}`}>
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-muted/50 rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="relative hover:bg-muted/50 rounded-full"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
              <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center border border-background">
                {language.toUpperCase()}
              </span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-muted/50 rounded-full"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className={`h-5 w-5 ${overHero ? 'text-white' : 'text-slate-700'}`} />
              )}
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex hover:bg-muted/50 rounded-full">
              <Link to="/wishlist" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground flex items-center justify-center border border-background animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Cart with Mini Preview */}
            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground flex items-center justify-center border border-background">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                align="end" 
                className="w-auto p-4 hidden sm:block bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl"
                sideOffset={8}
              >
                <MiniCartPreview />
              </HoverCardContent>
            </HoverCard>

            {/* User Account / Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted/50 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-xl p-1.5">
                  <DropdownMenuItem asChild className="rounded-lg py-2">
                    <Link to="/account">{t('nav.account', 'My Account')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg py-2">
                    <Link to="/account/orders">{t('nav.orders', 'My Orders')}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="rounded-lg py-2 bg-primary/10 text-primary focus:bg-primary/20">
                      <Link to="/admin">{t('nav.admin', 'Admin Dashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex hover:bg-muted/50 rounded-full px-3 py-1.5 h-auto text-xs font-semibold gap-1.5">
                <Link to="/auth" className="flex items-center gap-1.5">
                  <LogIn className="h-4 w-4" />
                  <span>{isRTL ? "تسجيل الدخول" : "Login"}</span>
                </Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted/50 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'left' : 'right'} className="w-80 bg-background/95 backdrop-blur-md">
                <div className="flex flex-col gap-5 mt-8">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex justify-center mb-4">
                    <AnimatedLogo />
                  </Link>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearchSubmit} className="w-full relative px-2 mb-2">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      value={searchVal}
                      onChange={handleSearchChange}
                      placeholder={isRTL ? "ابحث عن الإضاءة..." : "Search..."}
                      className="pl-9 pr-4"
                    />
                  </form>
                  
                  <div className="flex flex-col gap-1 px-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-semibold py-2.5 px-4 rounded-xl hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-border my-2" />

                  {/* Mobile Categories list */}
                  <div className="px-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {isRTL ? "الأقسام الرئيسية" : "Main Categories"}
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map(cat => (
                        <Link 
                          key={cat.slug} 
                          to={`/shop?category=${cat.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm py-1.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {isRTL ? cat.labelAr : cat.labelEn}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-border my-2" />
                  
                  {/* User Account Links - Mobile */}
                  {user ? (
                    <div className="flex flex-col gap-2 px-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 mb-1">
                        {t('nav.account', 'My Account')}
                      </p>
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-muted transition-colors text-sm font-semibold"
                      >
                        <User className="h-5 w-5 text-muted-foreground" />
                        {t('nav.myAccount', 'Account Overview')}
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-muted transition-colors text-sm font-semibold"
                      >
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        {t('nav.orders', 'My Orders')}
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-muted transition-colors w-full text-sm font-semibold"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-muted-foreground" />
                          <span>{t('nav.wishlist', 'Wishlist')}</span>
                        </div>
                        {wishlistCount > 0 && (
                          <span className="h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 21.5a2.5 2.5 0 0 0 2.32-1.56 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0 1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          {t('nav.admin', 'Admin Dashboard')}
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 mt-2">
                      <Button asChild className="w-full rounded-xl">
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          {isRTL ? "تسجيل الدخول" : "Login"}
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-4 mt-auto py-6 border-t border-border">
                    <Button variant="outline" size="icon" onClick={toggleLanguage} className="rounded-full">
                      <Globe className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
                      {resolvedTheme === 'dark' ? (
                        <Sun className="h-5 w-5 text-amber-400" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-border p-4 animate-fade-in bg-background/95 backdrop-blur-md">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder={isRTL ? "ابحث عن الإضاءة..." : "Search products..."}
                className="pl-9 pr-4"
                autoFocus
              />
            </form>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
