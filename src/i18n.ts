import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import zh from './locales/zh';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: localStorage.getItem('i18nextLng') || 'en', // Force initial language to English if not set in localStorage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Only check localStorage, ignore navigator/browser language to ensure default is English as requested
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
