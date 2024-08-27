import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/modules/store/create-store';
import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';
import { selectLoggedUser } from '@/modules/auth/core/store/auth.selectors';

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
