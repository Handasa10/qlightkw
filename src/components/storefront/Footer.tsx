import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronUp, 
  CreditCard, 
  Wallet, 
  Banknote,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';
import FooterWordmark from './FooterWordmark';

const Footer = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0f19] text-slate-300 font-cairo border-t border-slate-900 transition-colors">
      {/* 1. Newsletter Section with smooth gradient background */}
      <div className="border-b border-slate-900 bg-gradient-to-r from-slate-950 via-[#0b0f19] to-slate-950">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {isRTL ? "اشترك في النشرة الإخبارية لدينا" : "Subscribe to Our Newsletter"}
              </h3>
              <p className="text-sm text-slate-400">
                {isRTL 
                  ? "احصل على آخر التحديثات حول المنتجات الجديدة والعروض الحصرية مباشرة في بريدك" 
                  : "Get the latest updates on new products and exclusive promotions directly to your inbox"}
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-2 max-w-md">
              <Input
                type="email"
                placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11 focus-visible:ring-primary"
              />
              <Button className="rounded-xl px-6 h-11 font-semibold text-xs shadow-lg hover:shadow-primary/20 transition-all">
                {isRTL ? "اشترك" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Link Columns */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: About the Brand */}
          <div className="flex flex-col gap-5">
            <div>
              <AnimatedLogo className="brightness-0 invert scale-105 origin-left" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {isRTL 
                ? "كواليتي لايت هي شريكك الموثوق لحلول الإضاءة الفاخرة في الكويت. نقدم تشكيلة راقية من الإضاءة السكنية والتجارية والديكورية بأعلى معايير الجودة العالمية."
                : "Quality Light is your trusted partner for premium lighting solutions in Kuwait. We offer a curated range of residential, commercial, and decorative lighting products matching international quality standards."}
            </p>
            {/* Socials */}
            <div className="flex gap-2.5 mt-2">
              <a 
                href="https://www.facebook.com/share/1AxTFahzxq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 hover:bg-primary hover:text-white transition-all text-slate-400"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/quality_light1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 hover:bg-primary hover:text-white transition-all text-slate-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/96551111725" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white transition-all text-slate-400"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base tracking-wide relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>{isRTL ? "جميع المنتجات" : "All Products"}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>{isRTL ? "مشاريعنا المنفذة" : "Our Projects"}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>{isRTL ? "نبذة عن الشركة" : "About Us"}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>{isRTL ? "اتصل بنا" : "Contact"}</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>{isRTL ? "المدونة" : "Lighting Blog"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Center */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base tracking-wide relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
              {isRTL ? "مركز العملاء" : "Customer Support"}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  {isRTL ? "معلومات الشحن والتوصيل" : "Shipping & Delivery"}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  {isRTL ? "سياسة الإرجاع والاستبدال" : "Returns & Refunds"}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  {isRTL ? "الأسئلة الشائعة" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Location & Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base tracking-wide relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
              {isRTL ? "معلومات الاتصال المعرض" : "Showroom Contact"}
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span>
                    {isRTL 
                      ? "الكويت - حولي - شارع تونس" 
                      : "Hawalli - Tunis Street, Kuwait"}
                  </span>
                  <a 
                    href="https://maps.google.com/?q=Tunis+Street,+Hawalli,+Kuwait" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-primary flex items-center gap-1 hover:underline mt-0.5"
                  >
                    <span>{isRTL ? "عرض على الخريطة" : "Google Maps"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <a href="tel:+96551111725" className="hover:text-primary transition-colors" dir="ltr">
                  +965 5111 1725
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div className="flex flex-col">
                  <a href="mailto:info@qlightkw.com" className="hover:text-primary transition-colors">info@qlightkw.com</a>
                  <a href="mailto:sales@qlightkw.com" className="hover:text-primary transition-colors">sales@qlightkw.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-medium text-white">{isRTL ? "السبت - الخميس:" : "Saturday - Thursday:"}</span>
                  <span>9:00 AM - 9:00 PM</span>
                  <span className="text-xs text-amber-500 font-semibold mt-0.5">{isRTL ? "الجمعة: مغلق" : "Friday: Closed"}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <FooterWordmark />

      {/* 3. Payment Methods & Copyright bar */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Quality Light. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            
            {/* Payment brand badges with interactive hover states */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-slate-500 mr-1">{isRTL ? "وسائل الدفع المتوفرة:" : "Payment Methods:"}</span>
              
              {/* K-Net (Kuwait Local Payment) */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-[#00529B] to-[#0073B1] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-slate-800"
              >
                <Wallet className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-extrabold text-white tracking-tight">K-NET</span>
              </motion.div>

              {/* Visa */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-[#1A1F71] to-[#2E3192] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-slate-800"
              >
                <CreditCard className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-extrabold text-white tracking-wider">VISA</span>
              </motion.div>

              {/* Mastercard */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-[#1f2029] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-slate-800"
              >
                <div className="flex -space-x-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-80" />
                </div>
                <span className="text-[10px] font-extrabold text-white tracking-wider">MC</span>
              </motion.div>

              {/* Cash on Delivery */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md border border-slate-800"
              >
                <Banknote className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-extrabold text-white tracking-tight">{isRTL ? "نقدي" : "COD"}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all p-2 h-10 w-10 border border-white/10"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;
