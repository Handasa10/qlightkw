import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import PageTransition from "@/components/PageTransition";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import "@/i18n"; // Initialize i18n

// Pages
import Index from "./pages/Index";
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Quote = lazy(() => import("./pages/Quote"));
const QuoteView = lazy(() => import("./pages/QuoteView"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Returns = lazy(() => import("./pages/Returns"));
const Shipping = lazy(() => import("./pages/Shipping"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));

// Account Layout & Pages
const AccountLayout = lazy(() => import("./layouts/AccountLayout"));
const AccountOverview = lazy(() => import("./pages/account/Overview"));
const AccountOrders = lazy(() => import("./pages/account/Orders"));
const AccountOrderDetail = lazy(() => import("./pages/account/OrderDetail"));
const AccountAddresses = lazy(() => import("./pages/account/Addresses"));
const AccountSettings = lazy(() => import("./pages/account/Settings"));
const AccountWishlist = lazy(() => import("./pages/account/Wishlist"));

// Admin Layout & Pages
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const ProductsPage = lazy(() => import("./pages/admin/Products"));
const CategoriesPage = lazy(() => import("./pages/admin/Categories"));
const BrandsPage = lazy(() => import("./pages/admin/Brands"));
const OrdersPage = lazy(() => import("./pages/admin/Orders"));
const UsersPage = lazy(() => import("./pages/admin/Users"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminSystemLogs = lazy(() => import("./pages/admin/SystemLogs"));
const AdminEmailInbox = lazy(() => import("./pages/admin/EmailInbox"));
const AdminObservability = lazy(() => import("./pages/admin/Observability"));
const AdminVisitors = lazy(() => import("./pages/admin/Visitors"));
const AdminImageGallery = lazy(() => import("./pages/admin/ImageGallery"));
const AdminImageValidator = lazy(() => import("./pages/admin/ImageValidator"));
const AdminImageCacher = lazy(() => import("./pages/admin/ImageCacher"));
const AdminInventoryAlerts = lazy(() => import("./pages/admin/InventoryAlerts"));
const AdminBanners = lazy(() => import("./pages/admin/Banners"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminTags = lazy(() => import("./pages/admin/Tags"));
const AdminDocumentation = lazy(() => import("./pages/admin/Documentation"));
const SettingsPage = lazy(() => import("./pages/admin/Settings"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminQuotes = lazy(() => import("./pages/admin/AdminQuotes"));
const ProductFormPage = lazy(() => import("./pages/admin/ProductForm"));
const AdminBlogPosts = lazy(() => import("./pages/admin/BlogPosts"));
const AdminBlogDrafts = lazy(() => import("./pages/admin/BlogDrafts"));
const AdminNewsletterSubscribers = lazy(() => import("./pages/admin/NewsletterSubscribers"));
const AdminThemeBuilder = lazy(() => import("./pages/admin/ThemeBuilder"));
const AdminStorageMigration = lazy(() => import("./pages/admin/StorageMigration"));

const queryClient = new QueryClient();

// Animated Routes wrapper component with visitor tracking
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Track page visits for analytics
  useVisitorTracking();
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes location={location}>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/:id" element={<QuoteView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* Account routes */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
          {/* Order detail is separate as it uses its own layout */}
          <Route path="/account/orders/:id" element={<AccountOrderDetail />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="visitors" element={<AdminVisitors />} />
            <Route path="images" element={<AdminImageGallery />} />
            <Route path="image-validator" element={<AdminImageValidator />} />
            <Route path="image-cacher" element={<AdminImageCacher />} />
            <Route path="inventory" element={<AdminInventoryAlerts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="blog-posts" element={<AdminBlogPosts />} />
            <Route path="blog-drafts" element={<AdminBlogDrafts />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="logs" element={<AdminSystemLogs />} />
            <Route path="inbox" element={<AdminEmailInbox />} />
            <Route path="observability" element={<AdminObservability />} />
            <Route path="documentation" element={<AdminDocumentation />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="newsletter" element={<AdminNewsletterSubscribers />} />
            <Route path="theme-builder" element={<AdminThemeBuilder />} />
            <Route path="storage-migration" element={<AdminStorageMigration />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
};

const SPLASH_SEEN_KEY = "qlight-splash-seen";

// Show the splash once per browser session; returning to the tab or reloading skips it
const shouldShowSplash = () => {
  try {
    if (sessionStorage.getItem(SPLASH_SEEN_KEY)) return false;
    sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode etc.) - just show it
  }
  return true;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);

  useEffect(() => {
    if (!showSplash) return;
    // The site renders underneath, so the splash only needs to be a brief brand moment
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AnimatePresence mode="wait">
                    {showSplash && (
                      <SplashScreen onComplete={handleSplashComplete} />
                    )}
                  </AnimatePresence>
                  <BrowserRouter>
                    <AnimatedRoutes />
                  </BrowserRouter>
                </TooltipProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
