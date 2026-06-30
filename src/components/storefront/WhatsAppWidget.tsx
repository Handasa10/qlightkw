import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WhatsAppWidget() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const phoneNumber = '96551111725';

  const handleOpenExpertChat = () => {
    const text = isRTL 
      ? 'السلام عليكم، أود التحدث مع خبير الإضاءة بخصوص تصميم توزيع الإضاءة لمشروعي.' 
      : 'Hello, I would like to chat with a lighting design expert regarding my project layout.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenContractorChat = () => {
    const text = isRTL 
      ? 'مرحباً كواليتي لايت، أود الاستفسار عن أسعار الجملة للمقاولين والمشاريع.' 
      : 'Hello, I am a contractor and I would like to inquire about commercial project pricing.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  const handleSendCustomMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(userMsg.trim())}`, '_blank');
    setUserMsg('');
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 flex flex-col items-end gap-3 font-cairo`}>
      
      {/* 1. Expandable Floating Support Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`w-[320px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col`}
          >
            {/* Header: Brand and Online status */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                    QL
                  </div>
                  {/* green pulse online indicator dot */}
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide">
                    {isRTL ? "مستشاري كواليتي لايت" : "QUALITY LIGHT Support"}
                  </h4>
                  <span className="text-[10px] text-emerald-100 font-semibold flex items-center gap-1">
                    {isRTL ? "متصل الآن للمساعدة" : "Online - Ask Us Anything"}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 text-white hover:bg-white/10 rounded-full shrink-0"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Content list */}
            <div className="p-4 flex flex-col gap-3 bg-slate-950/60 max-h-[320px] overflow-y-auto">
              
              {/* Option 1: Lighting Expert */}
              <button
                onClick={handleOpenExpertChat}
                className="w-full flex items-start gap-3 p-3 bg-slate-900 hover:bg-primary/10 hover:border-primary/20 border border-slate-800/80 rounded-2xl transition-all text-left text-xs group"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="h-9 w-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="font-bold text-white group-hover:text-primary transition-colors">
                    {isRTL ? "تحدث مع مهندس إضاءة" : "Chat with Lighting Expert"}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {isRTL ? "استشارة مجانية بخصوص الفتحات والواط واللومن لمشروعك." : "Get structural advice on layout, watts, and CCT."}
                  </p>
                </div>
              </button>

              {/* Option 2: Contractor Sales */}
              <button
                onClick={handleOpenContractorChat}
                className="w-full flex items-start gap-3 p-3 bg-slate-900 hover:bg-primary/10 hover:border-primary/20 border border-slate-800/80 rounded-2xl transition-all text-left text-xs group"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="h-9 w-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h5 className="font-bold text-white group-hover:text-primary transition-colors">
                    {isRTL ? "مبيعات المقاولين والمشاريع B2B" : "Contractor Sales Support"}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {isRTL ? "تسعير العقود وتوريد كميات الفيلات والمباني التجارية." : "Inquire about wholesale pricing & villa packages."}
                  </p>
                </div>
              </button>

            </div>

            {/* Custom Input messaging form */}
            <form onSubmit={handleSendCustomMsg} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <Input
                type="text"
                placeholder={isRTL ? "اكتب استفسارك هنا..." : "Type your message..."}
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white rounded-xl h-9.5 text-xs focus-visible:ring-emerald-500"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-9.5 w-9.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-none shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Circular Trigger Button */}
      <div className="relative">
        
        {/* Pulse Ring Overlay */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500"
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Core button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border border-emerald-300/20 text-white z-50 focus:outline-none"
          aria-label="WhatsApp support center"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        </motion.button>

      </div>

    </div>
  );
}
