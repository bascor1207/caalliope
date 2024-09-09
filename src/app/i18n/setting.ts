import type { InitOptions } from 'i18next';

export const fallbackLng = 'en';
export const locales = [fallbackLng, 'fr'] as const;
export type LocaleTypes = (typeof locales)[number];
export const defaultNS = 'translation';

export function getOptions(lang = fallbackLng, ns = defaultNS): InitOptions {
    return {
        // debug: true, // Set to true to see console logs
        supportedLngs: locales,
        fallbackLng,
        lng: lang,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    };
}
