import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@/locales/en/translation.json';
import frTranslation from '@/locales/fr/translation.json';

export const initLocale = (language: string) => {
    const resources = {
        en: {
            translation: enTranslation
        },
        fr: {
            translation: frTranslation
        }
    };
    i18n.use(initReactI18next)
        .init({
            resources,
            lng: language,
            fallbackLng: 'fr',
            saveMissing: true,
            interpolation: {
                escapeValue: false
            },
            react: {
                useSuspense: false
            }
        });

    return i18n;
}

export default i18n;
