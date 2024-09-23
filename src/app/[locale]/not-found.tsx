'use client';
import { Button, Link } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-4xl font-bold text-gray-800'>{t('notFound.title')}</h1>
            <p className='mt-2 text-lg text-gray-600'>
                {t('notFound.description')}
            </p>
            <Button as={Link} href={'/'} className='bg-custom-purple m-6'>
                {t('notFound.backHome')}
            </Button>
        </div>
    );
}
