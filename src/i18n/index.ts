import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

// Define available languages
export const languages = {
  en: { name: 'English', dir: 'ltr', flag: '🇺🇸' },
  ar: { name: 'العربية', dir: 'rtl', flag: '🇰🇼' },
} as const;

export type Language = keyof typeof languages;

// A ?lang=ar / ?lang=en link wins (so search engines can index each language at its own URL),
// then the visitor's saved choice, then English
export const getUrlLanguage = (): Language | null => {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get('lang');
  return param && param in languages ? (param as Language) : null;
};

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const fromUrl = getUrlLanguage();
    if (fromUrl) {
      try { localStorage.setItem('language', fromUrl); } catch { /* storage unavailable */ }
      return fromUrl;
    }
    const saved = localStorage.getItem('language');
    if (saved && saved in languages) {
      return saved as Language;
    }
  }
  return 'en';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Function to change language and update document direction
export const changeLanguage = (lang: Language) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('language', lang);
  
  // Update document language and direction
  document.documentElement.lang = lang;
  document.documentElement.dir = languages[lang].dir;
};

export default i18n;
