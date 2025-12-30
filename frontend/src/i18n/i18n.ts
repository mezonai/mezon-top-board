import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
    en: {translation: translationEN},
    vi: {translation: translationVI}
}

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    load: "languageOnly",

    detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage']
    },

    interpolation: {
        escapeValue: false
    }
})

export default i18n;