import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from '../locales/pt-BR.json';
import ptPT from '../locales/pt-PT.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const resources = {
  'pt-BR': { translation: ptBR },
  'pt-PT': { translation: ptPT },
  'en': { translation: en },
  'es': { translation: es },
};

// Check stored language or default to pt-BR
const savedLang = localStorage.getItem('chronos_lang') || 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('chronos_lang', lng);
  document.documentElement.lang = lng;
});

export default i18n;
