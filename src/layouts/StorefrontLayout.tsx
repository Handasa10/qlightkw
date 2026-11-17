import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';
import AdminToolbar from '@/components/storefront/AdminToolbar';
import CartDrawer from '@/components/storefront/CartDrawer';
import QuickView from '@/components/storefront/QuickView';
import FlyToCart from '@/components/storefront/FlyToCart';
import MobileTabBar from '@/components/storefront/MobileTabBar';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  // Kept for older pages; the store is always light now
  showroom?: boolean;
}

// The store is always shown in its light palette ("store-light"), whatever the admin theme is
const StorefrontLayout = ({ children }: StorefrontLayoutProps) => {
  return (
    <div className="store-light flex min-h-screen flex-col overflow-x-clip bg-white pb-16 text-neutral-900 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <CartDrawer />
      <QuickView />
      <FlyToCart />
      <MobileTabBar />
      {/* Only visible to admins */}
      <AdminToolbar />
    </div>
  );
};

export default StorefrontLayout;
