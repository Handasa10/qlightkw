import StorefrontLayout from '@/layouts/StorefrontLayout';
import HeroSection from '@/components/storefront/HeroSection';
import LightMarquee from '@/components/storefront/LightMarquee';
import FeaturedCategories from '@/components/storefront/FeaturedCategories';
import LightStory from '@/components/storefront/LightStory';
import ShopByApplication from '@/components/storefront/ShopByApplication';
import ProductsSection from '@/components/storefront/ProductsSection';
import WhyChooseUs from '@/components/storefront/WhyChooseUs';
import LightingGuide from '@/components/storefront/LightingGuide';
import ProjectsSection from '@/components/storefront/ProjectsSection';
import BrandsShowcase from '@/components/storefront/BrandsShowcase';
import TestimonialsSection from '@/components/storefront/TestimonialsSection';
import BlogSection from '@/components/storefront/BlogSection';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import CTASection from '@/components/storefront/CTASection';

// The home page is a dark "showroom": lighting reads best against darkness
const Index = () => {
  return (
    <StorefrontLayout showroom>
      <HeroSection />
      <LightMarquee />
      <FeaturedCategories />
      <LightStory />
      <ProductsSection />
      <WhyChooseUs />
      <ShopByApplication />
      <LightingGuide />
      <ProjectsSection />
      <BrandsShowcase />
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
      <CTASection />
    </StorefrontLayout>
  );
};

export default Index;
