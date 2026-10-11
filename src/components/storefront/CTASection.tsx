import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CTASection = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    projectType: 'villa',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, projectType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error(isRTL ? "يرجى ملء الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setLoading(true);
    // Simulate database insert/api request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success(isRTL ? "تم إرسال طلبك بنجاح!" : "Consultation request sent successfully!");
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      projectType: 'villa',
      notes: ''
    });
  };

  const handleWhatsAppInquiry = () => {
    const message = isRTL
      ? "مرحباً كواليتي لايت، أود طلب استشارة فنية مجانية لاختيار الإضاءة المناسبة لمشروعي."
      : "Hello QUALITY LIGHT, I would like to request a free technical lighting consultation for my project.";
    const url = `https://wa.me/96551111725?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 md:py-28 bg-[#fdfdfd] dark:bg-slate-900/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-slate-900 text-slate-100 p-8 md:p-16 border border-slate-800 shadow-2xl"
        >
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Header Content */}
            <div className={`text-center lg:text-left ${isRTL ? 'lg:text-right' : ''} max-w-2xl`}>
              <span className="eyebrow-light mb-4">
                {isRTL ? "استشارة مجانية بالكامل" : "100% Free Consultation"}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
                {isRTL ? "هل تحتاج مساعدة في اختيار الإضاءة؟" : "Need help choosing the right lighting?"}
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                {isRTL
                  ? "تواصل مع مهندسي الإضاءة لدينا لمساعدتك في حساب شدة الضوء وتوزيع فتحات السقف واختيار المقاسات الأنسب هندسياً لمشروعك السكني أو التجاري."
                  : "Connect with our specialized lighting engineers to help you calculate lux values, plan drywall cutout locations, and select the best commercial/residential fixtures."}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 justify-center">
              
              {/* WhatsApp CTA */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  onClick={handleWhatsAppInquiry}
                  className="w-full sm:w-auto rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/10 font-bold text-sm h-14 px-8 gap-2.5 border-none"
                >
                  <MessageSquare className="h-5 w-5 fill-white/10" />
                  <span>{isRTL ? "واتساب الآن" : "WhatsApp Now"}</span>
                </Button>
              </motion.div>

              {/* Consultation Dialog Form Modal */}
              <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(open) setSubmitted(false); }}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-2xl border-slate-700 hover:bg-slate-800 text-white font-bold text-sm h-14 px-8 gap-2.5 shadow-md"
                    >
                      <CalendarCheck className="h-5 w-5 text-primary" />
                      <span>{isRTL ? "طلب استشارة هندسية" : "Request Consultation"}</span>
                    </Button>
                  </motion.div>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[480px] bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-8 flex flex-col items-center justify-center gap-4">
                      <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                        <CheckCircle2 className="h-10 w-10 animate-bounce" />
                      </div>
                      <h3 className="font-extrabold text-xl text-white">
                        {isRTL ? "شكراً لطلبك!" : "Request Submitted!"}
                      </h3>
                      <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                        {isRTL 
                          ? "تم استلام طلبك بنجاح. سيقوم مهندس الإضاءة لدينا بالتواصل معك خلال 24 ساعة."
                          : "We have received your details. One of our lighting specialists will call you back within 24 hours."}
                      </p>
                      <Button onClick={() => setIsOpen(false)} className="mt-4 rounded-xl px-6">
                        {isRTL ? "إغلاق النافذة" : "Close"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
                        <DialogTitle className="text-xl md:text-2xl font-extrabold text-white">
                          {isRTL ? "طلب استشارة فنية مجانية" : "Free Technical Consultation"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
                          {isRTL
                            ? "أدخل بياناتك وسنقوم بالاتصال بك لمناقشة مخططات مشروعك وتقديم النصائح الهندسية."
                            : "Enter your contact info below. Our engineers will call you to discuss your project layout."}
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-300">
                            {isRTL ? "الاسم الكريم *" : "Your Name *"}
                          </label>
                          <Input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={isRTL ? "الاسم بالكامل" : "e.g. Ahmad Al-Kandari"}
                            className="bg-slate-950 border-slate-800 focus:border-primary text-white rounded-xl h-11 text-sm"
                          />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-300">
                            {isRTL ? "رقم الهاتف الكويتي/الخليجي *" : "Phone Number *"}
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g. +965 5111 1725"
                            className="bg-slate-950 border-slate-800 focus:border-primary text-white rounded-xl h-11 text-sm text-left"
                            dir="ltr"
                          />
                        </div>

                        {/* Project Type */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-300">
                            {isRTL ? "نوع المشروع" : "Project Type"}
                          </label>
                          <Select defaultValue={formData.projectType} onValueChange={handleSelectChange}>
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 text-sm">
                              <SelectValue placeholder={isRTL ? "اختر نوع المشروع" : "Select project type"} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                              <SelectItem value="villa">{isRTL ? "فيلا سكنية" : "Villa / Residential"}</SelectItem>
                              <SelectItem value="office">{isRTL ? "مكتب إداري" : "Office"}</SelectItem>
                              <SelectItem value="shop">{isRTL ? "محل / معرض تجاري" : "Retail Shop / Showroom"}</SelectItem>
                              <SelectItem value="garden">{isRTL ? "حدائق / مساحات خارجية" : "Landscape & Garden"}</SelectItem>
                              <SelectItem value="other">{isRTL ? "آخر" : "Other Project"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-300">
                            {isRTL ? "تفاصيل إضافية (اختياري)" : "Project Notes (Optional)"}
                          </label>
                          <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder={isRTL ? "اكتب هنا أي تفاصيل أو متطلبات خاصة..." : "Describe any specific guidelines or dimensions..."}
                            className="bg-slate-950 border-slate-800 focus:border-primary text-white rounded-xl min-h-[80px] text-sm resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-xl h-12 font-bold text-sm bg-primary hover:bg-primary-hover text-black shadow-lg hover:shadow-primary/20 transition-all mt-3 gap-2"
                        >
                          {loading ? (
                            <span>{isRTL ? "جاري الإرسال..." : "Submitting..."}</span>
                          ) : (
                            <>
                              <span>{isRTL ? "تأكيد وإرسال الطلب" : "Submit Consultation Request"}</span>
                              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
