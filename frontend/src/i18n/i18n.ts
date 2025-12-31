import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN from "./locales/en/common.json";
import pagesEN from "./locales/en/pages.json";
import profileEN from "./locales/en/profile.json";
import botEN from "./locales/en/bot.json";
import componentsEN from "./locales/en/components.json";
import validationEN from "./locales/en/validation.json";

import commonVI from "./locales/vi/common.json";
import pagesVI from "./locales/vi/pages.json";
import profileVI from "./locales/vi/profile.json";
import botVI from "./locales/vi/bot.json";
import componentsVI from "./locales/vi/components.json";
import validationVI from "./locales/vi/validation.json";

const resources = {
    en: {
        translation: {
            ...commonEN,
            ...pagesEN,
            ...profileEN,
            ...botEN,
            ...componentsEN,
            ...validationEN
        }
    },
    vi: {
        translation: {
            ...commonVI,
            ...pagesVI,
            ...profileVI,
            ...botVI,
            ...componentsVI,
            ...validationVI
        }
    }
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