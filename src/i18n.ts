import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@/locales/en/translation.json';
import frTranslation from '@/locales/fr/translation.json';

export const initLocale = () => {
    const resources = {
        en: {
            translation: enTranslation
        },
        fr: {
            translation: frTranslation
        }
    };
    i18n.use(initReactI18next) // passes i18n down to react-i18next
        .init({
            resources,
            lng: 'en',
            fallbackLng: 'fr', // use fr if detected lng is not available
            saveMissing: true, // send not translated keys to endpoint
            interpolation: {
                escapeValue: false // react already safes from xss
            },
            react: {
                useSuspense: false // don't use Suspense
            }
        });

    return i18n;
}

export default i18n;
