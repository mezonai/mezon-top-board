import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setYupLocale } from "@app/validations/yup-locale";

import commonEN from "./locales/en/common.json";
import homePageEN from "./locales/en/home_page.json";
import aboutPageEN from "./locales/en/about_page.json";
import termsPageEN from "./locales/en/terms_page.json";
import contactPageEN from "./locales/en/contact_page.json";
import onboardingPageEN from "./locales/en/onboarding_page.json";
import profilePageEN from "./locales/en/profile_page.json";
import botDetailPageEN from "./locales/en/bot_detail_page.json";
import newBotPageEN from "./locales/en/new_bot_page.json";
import botWizardPageEN from "./locales/en/bot_wizard_page.json";
import componentsEN from "./locales/en/components.json";
import validationEN from "./locales/en/validation.json";
import versionHistoryEn from "./locales/en/version_history.json";

import commonVI from "./locales/vi/common.json";
import homePageVI from "./locales/vi/home_page.json";
import aboutPageVI from "./locales/vi/about_page.json";
import termsPageVI from "./locales/vi/terms_page.json";
import contactPageVI from "./locales/vi/contact_page.json";
import onboardingPageVI from "./locales/vi/onboarding_page.json";
import profilePageVI from "./locales/vi/profile_page.json";
import botDetailPageVI from "./locales/vi/bot_detail_page.json";
import newBotPageVI from "./locales/vi/new_bot_page.json";
import botWizardPageVI from "./locales/vi/bot_wizard_page.json";
import componentsVI from "./locales/vi/components.json";
import validationVI from "./locales/vi/validation.json";
import versionHistoryVI from "./locales/vi/version_history.json";

const resources = {
    en: {
        common: commonEN,
        home_page: homePageEN,
        about_page: aboutPageEN,
        terms_page: termsPageEN,
        contact_page: contactPageEN,
        onboarding_page: onboardingPageEN,
        profile_page: profilePageEN,
        bot_detail_page: botDetailPageEN,
        new_bot_page: newBotPageEN,
        bot_wizard_page: botWizardPageEN,
        components: componentsEN,
        validation: validationEN,
        version_history: versionHistoryEn
    },
    vi: {
        common: commonVI,
        home_page: homePageVI,
        about_page: aboutPageVI,
        terms_page: termsPageVI,
        contact_page: contactPageVI,
        onboarding_page: onboardingPageVI,
        profile_page: profilePageVI,
        bot_detail_page: botDetailPageVI,
        new_bot_page: newBotPageVI,
        bot_wizard_page: botWizardPageVI,
        components: componentsVI,
        validation: validationVI,
        version_history: versionHistoryVI
    }
}

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    load: "languageOnly",

    ns: [
        'common', 
        'home_page', 
        'about_page', 
        'terms_page', 
        'contact_page', 
        'onboarding_page', 
        'profile_page', 
        'bot_detail_page', 
        'new_bot_page', 
        'bot_wizard_page', 
        'components', 
        'validation',
        'version_history'
    ],
    defaultNS: 'common',

    detection: {
        order: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage']
    },

    interpolation: {
        escapeValue: false
    }
})

setYupLocale();

i18n.on('languageChanged', () => {
    setYupLocale();
});

export default i18n;