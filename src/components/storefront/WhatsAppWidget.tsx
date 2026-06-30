import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenWhatsApp = () => {
    const defaultMessage = isRTL
      ? 'السلام عليكم، لدي استفسار بخصوص كواليتي لايت'
      : 'Hello, I have an inquiry regarding Quality Light';
    
    // Official WhatsApp Number
    const phoneNumber = '96551111725';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: isRTL ? -15 : 15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: isRTL ? -15 : 15 }}
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? 'right-16' : 'left-16'
              } bg-black/85 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg border border-white/10`}
            >
              {t('common.whatsappWidgetTooltip', 'Chat on WhatsApp')}
              {/* Pointer arrow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 border-8 border-transparent ${
                  isRTL ? 'left-full border-l-black/85' : 'right-full border-r-black/85'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-500"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating Green Button */}
        <motion.button
          onClick={handleOpenWhatsApp}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl border border-emerald-300/20 text-white z-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label={t('common.whatsappWidgetTooltip', 'Chat on WhatsApp')}
        >
          <MessageCircle className="h-7 w-7" />
        </motion.button>
      </div>
    </div>
  );
}
