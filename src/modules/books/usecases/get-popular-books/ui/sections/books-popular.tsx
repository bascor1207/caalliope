'use client'
import type { ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { BooksCarousel } from '@/modules/books/usecases/get-catalog/ui/components/books-carousel';
import { getPopularBooksViewmodel } from '@/modules/books/usecases/get-popular-books/ui/get-popular-books.viewmodel';


export const PopularBooksCarousels = () => {
    const viewmodel = useAppSelector(getPopularBooksViewmodel())

    const nodeToRender: ReactNode = (() => {
        switch (viewmodel.type) {
            case 'gettingPopularBooksPending':
                return <CustomSpinner />;
            case 'gettingPopularBooksRejected':
                return <div>Oops...</div>;
            case 'gettingPopularBooksFulfilled':
                return (
                    <BooksCarousel slides={viewmodel.mostPopularBooks} title={''} />
                );
        }
    })();

    return nodeToRender;
}
