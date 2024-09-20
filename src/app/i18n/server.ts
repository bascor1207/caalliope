import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import type { LocaleTypes } from '@/app/i18n/setting';

import { getOptions } from '@/app/i18n/setting';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';


export const initI18next = async (lang: LocaleTypes, ns: string) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(
            resourcesToBackend(
                (language: string, namespace: typeof ns) =>

                    import(`../../locales/${language}/${namespace}.json`),
            ),
        )
        .init(getOptions(lang, ns));

    return i18nInstance;
};

export async function translateServerSide(language?: 'en' | 'fr') {
    if (typeof window !== 'undefined') {
        const lang = HttpCookiesProvider.getCookie('i18next') as 'en' | 'fr';
        const ns = 'translation';
        const i18nextInstance = await initI18next(language ?? lang, ns)
        return {
            t: i18nextInstance.getFixedT(language ??lang, Array.isArray(ns) ? ns[0] : ns, ),
            i18n: i18nextInstance
        }
    }
    const { cookies } = await import('next/headers');
    const lang = cookies().get('i18next')?.value as 'en' | 'fr';
    const ns = 'translation';
    const i18nextInstance = await initI18next(language ?? lang, ns)
    return {
        t: i18nextInstance.getFixedT(language ?? lang, Array.isArray(ns) ? ns[0] : ns, ),
        i18n: i18nextInstance
    }
}
