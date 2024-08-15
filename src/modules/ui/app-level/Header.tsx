'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Grid3 } from '@/components/ui/containers';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';

const languages = ['en', 'fr'];

export function Header() {
    const { t, i18n } = useTranslation('navbar');

    const changeLanguage = () => async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        await i18n.changeLanguage(selectedLanguage);
    };

    return (
        <Grid3 className='h-full items-center'>
            <div></div>

            <div className='flex justify-center'>
                <Link href='/' legacyBehavior passHref>
                    <Image src='/logo.png' alt='Home Page' width={200} height={200} />
                </Link>
            </div>

            <div className='flex justify-center'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>{t('Langue')}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className='z-55 inline-flex gap-2 p-4'>
                                    {languages.map((language) => (
                                        <Button onClick={changeLanguage} key={language} variant='invert' className='bg-custom-purple'>
                                            {t(`navbar.${language}`) }
                                        </Button>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </Grid3>
    );
}
