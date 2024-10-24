'use client'
import React from 'react';
import { useTranslation } from 'react-i18next';

import { BooksCarouselsLastRelease } from '@/modules/books/usecases/get-last-release-books/ui/sections/books-last-release';
import { PopularBooksCarousels } from '@/modules/books/usecases/get-popular-books/ui/sections/books-popular';

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center justify-between w-full px-4 sm:px-6 md:px-8 lg:px-12 my-5'>
            {/* Last Release Section */}
            <div className='w-full mb-8'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>{t('home.lastRelease')}</h1>
                <BooksCarouselsLastRelease />
            </div>

            {/* Popular Books Section */}
            <div className='w-full mb-8'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>{t('home.popular')}</h2>
                <PopularBooksCarousels />
            </div>
        </div>
    )
}
