import { useParams, useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { ChangeEvent } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLoggedUser } from '@/modules/auth/core/store/auth.selectors';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

const ACCOUNT_PATHS = {
    MY_INFOS: 'activeTab=my-infos',
    MY_BOOKS: 'activeTab=my-books'
} as const


export const useHeader = () => {
    const dispatch = useDispatch<AppDispatch>();
    const locale = useParams()?.locale;
    const LINKS_ITEMS = [
        {
            label: 'Profile',
            href: `/${locale}/my-account?${ACCOUNT_PATHS.MY_INFOS}`,
            type: 'link'
        },
        {
            label: 'My books',
            href: `/${locale}/my-account?${ACCOUNT_PATHS.MY_BOOKS}`,
            type: 'link'
        },
        {
            href: '#',
            onPress: () => dispatch(logoutUserUsecase()),
            label: 'Logout',
            type: 'button'
        },
    ];
    const router = useRouter();
    const { t } = useTranslation();
    const urlSegments = useSelectedLayoutSegments();

    const languages = ['English', 'French']

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value === 'English' ? 'en' : 'fr'
        cookiesProvider.current.setCookie('i18next', selectedLanguage);

        router.push(`/${selectedLanguage}/${urlSegments.join('/')}`);
    };

    const loggedUser = useAppSelector(selectLoggedUser)
    const cookiesProvider =  useRef(new HttpCookiesProvider());

    return { linkItems: LINKS_ITEMS, router, dispatch, languages, changeLanguage, t, loggedUser, locale };
}
