import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AIAssistant from '@/components/AIAssistant';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';
import AdminToolbar from '@/components/storefront/AdminToolbar';
import ScrollProgress from '@/components/effects/ScrollProgress';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  // Render the page in the dark "showroom" palette regardless of the visitor's theme
  showroom?: boolean;
}

const StorefrontLayout = ({ children, showroom }: StorefrontLayoutProps) => {
  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col ${showroom ? 'dark' : ''}`}>
      <ScrollProgress />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* AI Assistant - floating chatbot */}
      <AIAssistant />
      {/* WhatsApp Support Widget */}
      <WhatsAppWidget />
      {/* Admin Toolbar - only visible to admins */}
      <AdminToolbar />
    </div>
  );
};

export default StorefrontLayout;
