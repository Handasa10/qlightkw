import { Link } from 'react-router-dom';
import { Banknote, Facebook, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEPARTMENTS } from '@/lib/store-nav';
import logo from '@/assets/logo.png';

// Store footer: departments, customer service, contact
const Footer = () => {
  const { isRTL } = useLanguage();
  const help: Array<[string, string, string]> = [
    ['/shipping', 'Delivery', 'التوصيل'],
    ['/returns', 'Returns & exchange', 'الاسترجاع والاستبدال'],
    ['/faq', 'FAQ', 'الأسئلة الشائعة'],
    ['/quote', 'Instant quotation', 'عرض سعر فوري'],
    ['/account/orders', 'My orders', 'طلباتي'],
    ['/contact', 'Contact us', 'اتصل بنا'],
  ];
  const company: Array<[string, string, string]> = [
    ['/about', 'About us', 'من نحن'],
    ['/privacy', 'Privacy policy', 'سياسة الخصوصية'],
    ['/terms', 'Terms & conditions', 'الشروط والأحكام'],
  ];
  const heading = 'mb-4 text-sm font-bold text-neutral-900';
  const link = 'block py-1.5 text-sm text-neutral-600 hover:text-primary';

  return (
    <footer className="mt-10 border-t border-neutral-200 bg-[#fafafa] text-neutral-900">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src={logo} alt="Quality Light" className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-600">
            {isRTL ? 'كواليتي لايت: متجر الإضاءة والكهربائيات في الكويت. معرضنا في حولي والتوصيل لجميع المناطق.' : 'Quality Light: Kuwait’s lighting and electrical store. Showroom in Hawalli, delivery everywhere in Kuwait.'}
          </p>
          <div className="mt-5 space-y-2.5 text-sm text-neutral-700">
            <a href="tel:+96551111725" className="flex items-center gap-2.5 hover:text-primary"><Phone className="h-4 w-4 text-primary" /><span dir="ltr">+965 5111 1725</span></a>
            <a href="https://wa.me/96551111725" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-primary"><MessageCircle className="h-4 w-4 text-primary" />WhatsApp</a>
            <a href="https://maps.google.com/?q=Tunis+Street,+Hawalli,+Kuwait" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-primary"><MapPin className="h-4 w-4 text-primary" />{isRTL ? 'حولي – شارع تونس' : 'Tunis Street, Hawalli'}</a>
          </div>
          <div className="mt-5 flex gap-2">
            <a href="https://www.instagram.com/quality_light1" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-900"><Instagram className="h-[18px] w-[18px]" /></a>
            <a href="https://www.facebook.com/profile.php?id=61585692185759" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-900"><Facebook className="h-[18px] w-[18px]" /></a>
          </div>
        </div>

        <div>
          <h3 className={heading}>{isRTL ? 'الأقسام' : 'Departments'}</h3>
          {DEPARTMENTS.map((d) => <Link key={d.id} to={`/shop?dept=${d.id}`} className={link}>{isRTL ? d.ar : d.en}</Link>)}
          <Link to="/shop?offers=true" className={`${link} font-semibold text-red-600`}>{isRTL ? 'العروض' : 'Offers'}</Link>
        </div>

        <div>
          <h3 className={heading}>{isRTL ? 'خدمة العملاء' : 'Customer service'}</h3>
          {help.map(([href, en, ar]) => <Link key={href} to={href} className={link}>{isRTL ? ar : en}</Link>)}
        </div>

        <div>
          <h3 className={heading}>{isRTL ? 'كواليتي لايت' : 'Quality Light'}</h3>
          {company.map(([href, en, ar]) => <Link key={href} to={href} className={link}>{isRTL ? ar : en}</Link>)}
          <p className="mt-5 flex items-center gap-2 text-sm text-neutral-600"><Banknote className="h-4 w-4 text-primary" />{isRTL ? 'الدفع عند الاستلام' : 'Cash on delivery'}</p>
        </div>
      </div>
      <div className="border-t border-neutral-200">
        <p className="container py-5 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Quality Light Kuwait · {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
      </div>
    </footer>
  );
};

export default Footer;
