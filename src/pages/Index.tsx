import StorefrontLayout from '@/layouts/StorefrontLayout';
import HeroSection from '@/components/storefront/HeroSection';
import FeaturedCategories from '@/components/storefront/FeaturedCategories';
import ProductsSection from '@/components/storefront/ProductsSection';
import WhyChooseUs from '@/components/storefront/WhyChooseUs';
import BrandsShowcase from '@/components/storefront/BrandsShowcase';
import TestimonialsSection from '@/components/storefront/TestimonialsSection';
import ProjectsSection from '@/components/storefront/ProjectsSection';
import CTASection from '@/components/storefront/CTASection';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import BlogSection from '@/components/storefront/BlogSection';

const Index = () => {
  return (
    <StorefrontLayout>
      <HeroSection />
      <FeaturedCategories />
      <ProductsSection />
      <WhyChooseUs />
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
