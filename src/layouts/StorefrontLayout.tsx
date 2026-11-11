import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';
import AdminToolbar from '@/components/storefront/AdminToolbar';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  // Kept for older pages; the store is always light now
  showroom?: boolean;
}

// The store is always shown in its light palette ("store-light"), whatever the admin theme is
const StorefrontLayout = ({ children }: StorefrontLayoutProps) => {
  return (
    <div className="store-light flex min-h-screen flex-col overflow-x-clip bg-white text-neutral-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
      {/* Only visible to admins */}
      <AdminToolbar />
    </div>
  );
};

export default StorefrontLayout;
