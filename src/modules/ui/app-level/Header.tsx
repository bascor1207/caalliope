'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';
import { CustomNavBar } from '@/modules/ui/component-level/custom.navbar';
import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';


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

export const Header = () => {
    const { t, i18n } = useTranslation();

    const languages = ['en', 'fr']
    const languagesOptions = languages.filter((language) => language !== i18n.language)

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        await i18n.changeLanguage(selectedLanguage);
    };

    return (
        <CustomNavBar
            renderLogo={() => (
                <Link href='/'>
                    <Image src='/logo.png' alt='Home Page' width={200} height={200} />
                </Link>
            )}
            renderMenuToggle={() => (
                <Image src='/menu.svg' alt='menu icon' width={36} height={36} />
            )}
            renderRightContent={() => (
                <>
                    <Select
                        label={t(`navbar.${i18n.language}`)}
                        className='bg-custom-grey'
                        labelPlacement='inside'
                        variant='bordered'
                    >
                        {languagesOptions.map((language) =>
                           (
                                <SelectItem key={language} onClick={changeLanguage}>
                                    {t(`navbar.${language}`)}
                                </SelectItem>
                            )
                    )}
                    </Select>
                    <Button
                        radius='lg'
                        className={twMerge(
                            'border border-custom-grey text-text-custom-color px-8',
                            'hover:text-black hover:bg-custom-grey',
                            'transition duration-150'
                    )}>
                        Login
                    </Button>
                    <Button
                        radius='lg'
                        className={twMerge(
                            'text-text-custom-color px-8',
                            'hover:text-black hover:bg-custom-grey',
                            'transition duration-150'
                    )}>
                        Sign Up
                    </Button>
                </>
            )}
            renderMenuContent={() => (
                <>
                    {LINKS_ITEMS.map((link, idx) => (
                        <Link
                            href={link.href}
                            className={twMerge('flex items-center justify-start gap-2 py-2 transition duration-150 hover:bg-custom-purple opacity-100')}
                            key={idx}
                        >
                            {link.icon}
                            <span className='text-gray-900 text-sm whitespace-pre'>
                            {link.label}
                        </span>
                        </Link>
                    ))}
                </>
            )}
            showMenu={true}
        />
    );
}
