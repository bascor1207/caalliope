'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className='flex justify-between bg-purple-100 p-5 h-24'>
            <div className='flex items-center gap-12'>
                <Link className='flex justify-center text-lg cursor-pointer hover:font-bold' href='/'>
                    { t('footer.donation') }
                </Link>
                <Link className='flex justify-center text-lg cursor-pointer hover:font-bold' href='/'>
                    { t('footer.contact') }
                </Link>
            </div>
        </div>
    )
}
