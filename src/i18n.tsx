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

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;