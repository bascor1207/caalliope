import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/modules/store/create-store';
import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';

export const useHeader = () => {
    const LINKS_ITEMS = [
        {
            label: 'Profile',
            href: '/my-account',
            icon: (
                <Image
                    src='/user.webp'
                    alt='Mon compte'
                    width={36}
                    height={36}
                />
            ),
        },
        {
            label: 'My books',
            href: '/my-books',
            icon: (
                <Image
                    src='/my-books.webp'
                    alt='logo'
                    width={36}
                    height={36}
                />
            ),
        },
        {
            label: 'Logout',
            href: '#',
            icon: (
                <Image
                    src='/logo.png'
                    alt='logo'
                    width={36}
                    height={36}
                />
            ),
        },
    ];
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { t, i18n } = useTranslation();

    const languages = ['English', 'French']

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value === 'English' ? 'en' : 'fr'
        await i18n.changeLanguage(selectedLanguage);
    };



    return { linkItems: LINKS_ITEMS, router, dispatch, languages, changeLanguage, i18n, t };
}
