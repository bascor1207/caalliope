import {
 useParams, usePathname, useRouter, useSelectedLayoutSegments
} from 'next/navigation';
import { useRef, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { ChangeEvent } from 'react';

import { translateServerSide } from '@/app/i18n/server';
import i18n from '@/i18n';
import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLoggedUser } from '@/modules/auth/core/store/auth.selectors';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

const ACCOUNT_PATHS = {
    ADMIN_PANEL: 'activeTab=admin',
    MY_INFOS: 'activeTab=my-infos',
    MY_BOOKS: 'activeTab=my-books',
} as const


export const useHeader = () => {
    const dispatch = useDispatch<AppDispatch>();
    const locale = useParams()?.locale;
    const pathname = usePathname();
    const { t } = useTranslation();
    const activeUser = useAppSelector(selectActiveUser);

    const linkItems = [
        activeUser?.roles?.includes('admin') &&{
            label: t('navbar.admin'),
            href: `/${locale}/admin?${ACCOUNT_PATHS.ADMIN_PANEL}`,
            type: 'link'
        },
        {
            label: t('navbar.account'),
            href: `/${locale}/my-account?${ACCOUNT_PATHS.MY_INFOS}`,
            type: 'link'
        },
        {
            label: t('navbar.myBooks'),
            href: `/${locale}/my-account?${ACCOUNT_PATHS.MY_BOOKS}`,
            type: 'link'
        },
        {
            href: '#',
            onPress: () => dispatch(logoutUserUsecase()).then(() => pathname.includes('/my-account') ? router.push(`/${locale}/`) : null),
            label: t('navbar.logout'),
            type: 'button'
        },
    ].filter(Boolean) as {label: string, href: string, type: 'link' | 'button', onPress?: () => void}[];

    const router = useRouter();
    const urlSegments = useSelectedLayoutSegments();
    const languages = () => (
        locale === 'en' ? (
            [{ label: 'English', shortKeyForTrad: 'en', shortKeyForSVG: 'gb' }, { label: 'French', shortKeyForTrad: 'fr', shortKeyForSVG: 'fr' }]
        ) : (
            [{ label: 'Français', shortKeyForTrad: 'fr', shortKeyForSVG: 'fr' }, { label: 'English', shortKeyForTrad: 'en', shortKeyForSVG: 'gb' }]
        )
    )

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value === 'en' ? 'en' : 'fr'
        await i18n.changeLanguage(selectedLanguage);
        await translateServerSide(selectedLanguage);
        cookiesProvider.current.setCookie('i18next', selectedLanguage);

        router.push(`/${selectedLanguage}/${urlSegments.join('/')}`);
    };

    const [isLoading, startTransition] = useTransition();

    const handleRouteChange = (url?: string) => {
        startTransition(() => url ?
           router.push(url) :
           router.push(`/${locale}/catalog`)
        );
    }

    const loggedUser = useAppSelector(selectLoggedUser)
    const cookiesProvider =  useRef(new HttpCookiesProvider());

    return { linkItems, router, dispatch, languages: languages(), changeLanguage, t, loggedUser, locale, handleRouteChange, isLoading };
}
