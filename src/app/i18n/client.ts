'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect } from 'react';
import { initReactI18next, useTranslation as useTransAlias } from 'react-i18next';

import type { LocaleTypes } from '@/app/i18n/setting';
import type { i18n } from 'i18next';

import { getOptions, locales } from '@/app/i18n/setting';


const runsOnServerSide = typeof window === 'undefined';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
        resourcesToBackend(
            (language: LocaleTypes, namespace: string) =>
                import(`./locales/${language}/${namespace}.json`),
        ),
    )
    .init({
        ...getOptions(),
        lng: undefined,
        detection: {
            order: ['path'],
        },
        preload: runsOnServerSide ? locales : [],
    });

export function useTranslation(lng: LocaleTypes, ns: string) {
    const translator = useTransAlias(ns);
    const { i18n } = translator;

    // Run when content is rendered on server side
    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomTranslationImplem(i18n, lng);
    }
    return translator;
}

function useCustomTranslationImplem(i18n: i18n, lng: LocaleTypes) {
    useEffect(() => {
        if (!lng || i18n.resolvedLanguage === lng) return;
        i18n.changeLanguage(lng);
    }, [lng, i18n]);
}

