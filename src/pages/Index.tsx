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
import { useSEO } from '@/hooks/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';

// The home page is a dark "showroom": lighting reads best against darkness
const Index = () => {
  const { isRTL: seoAr } = useLanguage();
  useSEO({
    title: seoAr ? "محل إضاءة في الكويت | إنارة LED وثريات وسبوت لايت" : "Lighting Store in Kuwait | LED Lights, Chandeliers & Spotlights",
    description: seoAr ? "تسوق إنارة LED والثريات والسبوت لايت وشرائط LED والإضاءة المغناطيسية والخارجية في الكويت. معرضنا في حولي – شارع تونس. توصيل سريع لجميع مناطق الكويت. واتساب 51111725." : "Shop LED lights, chandeliers, spotlights, LED strips, magnetic track and outdoor lighting in Kuwait. Showroom on Tunis Street, Hawalli. Fast delivery across Kuwait. WhatsApp +965 5111 1725.",
  });
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
