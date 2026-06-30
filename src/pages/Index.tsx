import StorefrontLayout from '@/layouts/StorefrontLayout';
import HeroSection from '@/components/storefront/HeroSection';
import FeaturedCategories from '@/components/storefront/FeaturedCategories';
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

const Index = () => {
  return (
    <StorefrontLayout>
      <HeroSection />
      <FeaturedCategories />
      <ShopByApplication />
      <ProductsSection />
      <WhyChooseUs />
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
