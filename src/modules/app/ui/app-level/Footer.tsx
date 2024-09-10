'use client';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLocale } from '@/modules/app/core/store/root.selectors';

export const Footer = () => {
    const { t } = useTranslation();
    const language = useAppSelector(selectLocale);

    return (
        <div className='flex items-center justify-end text-custom-dark-purple p-5 h-24'>
            <div className='flex items-center gap-12'>
                <Link className='flex justify-center text-lg cursor-pointer hover:font-bold' href='/donate'>
                    { t('footer.donation') }
                </Link>
                <Button className='flex justify-center text-lg bg-transparent hover:bg-custom-grey' as={Link} href={`/${language}/contact`}>
                    { t('footer.contact') }
                </Button>
            </div>
        </div>
    )
}
