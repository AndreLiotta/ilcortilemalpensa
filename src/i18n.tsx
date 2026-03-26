import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEnglish from './Translation/English/translation.json';
import translationItalian from './Translation/Italian/translation.json';

const resources = {
  en: {
    translation: translationEnglish,
  },
  it: {
    translation: translationItalian,
  },
};

// Detect language from URL before React renders — prevents flash of wrong language
const pathLang = window.location.pathname.split('/')[1];
const initialLang = ['it', 'en'].includes(pathLang) ? pathLang : 'it';

i18next.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;