import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { ChangeEvent } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLoggedUser } from '@/modules/auth/core/store/auth.selectors';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

const ACCOUNT_PATHS = {
    MY_INFOS: 'activeTab=my-infos',
    MY_BOOKS: 'activeTab=my-books'
} as const


export const useHeader = () => {
    const dispatch = useDispatch<AppDispatch>()
    const LINKS_ITEMS = [
        {
            label: 'Profile',
            href: `/my-account?${ACCOUNT_PATHS.MY_INFOS}`,
            type: 'link'
        },
        {
            label: 'My books',
            href: `/my-account?${ACCOUNT_PATHS.MY_BOOKS}`,
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
    const { t, i18n } = useTranslation();

    const languages = ['English', 'French']

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value === 'English' ? 'en' : 'fr'
        await i18n.changeLanguage(selectedLanguage);
    };

    const loggedUser = useAppSelector(selectLoggedUser)



    return { linkItems: LINKS_ITEMS, router, dispatch, languages, changeLanguage, i18n, t, loggedUser };
}
