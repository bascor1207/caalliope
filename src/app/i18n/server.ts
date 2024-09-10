import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import type { LocaleTypes } from '@/app/i18n/setting';

import { getOptions } from '@/app/i18n/setting';


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
