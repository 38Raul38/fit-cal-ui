import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './lang/en.json';
import ru from './lang/ru.json';
import az from './lang/az.json';
import de from './lang/de.json';
import es from './lang/es.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  az: { translation: az },
  de: { translation: de },
  es: { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
