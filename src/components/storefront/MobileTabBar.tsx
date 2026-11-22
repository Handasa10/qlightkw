import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useStoreUI } from '@/contexts/StoreUIContext';

// App-style bottom bar on phones: home, departments, search, cart, account
const MobileTabBar = () => {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { setCartOpen } = useStoreUI();
  const { pathname } = useLocation();

  const focusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const input = [...document.querySelectorAll<HTMLInputElement>('input[type=search]')].find((el) => el.offsetParent !== null);
    setTimeout(() => input?.focus(), 250);
  };

  const item = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold';
  const active = (on: boolean) => (on ? 'text-primary' : 'text-neutral-500');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="flex">
        <Link to="/" className={`${item} ${active(pathname === '/')}`}><Home className="h-5 w-5" />{isRTL ? 'الرئيسية' : 'Home'}</Link>
        <Link to="/shop" className={`${item} ${active(pathname === '/shop')}`}><LayoutGrid className="h-5 w-5" />{isRTL ? 'الأقسام' : 'Shop'}</Link>
        <button type="button" onClick={focusSearch} className={`${item} text-neutral-500`}><Search className="h-5 w-5" />{isRTL ? 'بحث' : 'Search'}</button>
        <button type="button" onClick={() => setCartOpen(true)} className={`${item} relative text-neutral-500`}>
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">{itemCount}</span>}
          </span>
          {isRTL ? 'السلة' : 'Cart'}
        </button>
        <Link to={user ? '/account' : '/auth'} className={`${item} ${active(pathname.startsWith('/account'))}`}><User className="h-5 w-5" />{isRTL ? 'حسابي' : 'Account'}</Link>
      </div>
    </nav>
  );
};

export default MobileTabBar;
