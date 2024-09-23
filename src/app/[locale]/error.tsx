'use client';
import { Button, Link } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { contactUs } from '@/modules/user/core/store/user.slice';

export default function Error() {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-3xl font-bold text-red-600'>{t('error.title')}</h1>
            <p className='mt-2 text-lg text-gray-600'>
                {t('errorPage.description')}
            </p>
            <Button as={Link} href={'/'} className='bg-custom-purple m-6'>
                {t('errorPage.backHome')}
            </Button>
            <Button onPress={() => dispatch(contactUs('displayed'))} className='bg-custom-purple m-6'>
                {t('errorPage.contactUs')}
            </Button>
        </div>
    );
}
