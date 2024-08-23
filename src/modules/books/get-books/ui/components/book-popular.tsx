'use client'
import { ReactNode } from 'react';
import { getPopularBooksViewmodel } from '../get-popular-books/get-popular-books.viewmodel';
import BooksCarousel from '@/modules/books/get-books/ui/components/books-carousel';
import { CustomSpinner } from '@/modules/ui/app-level/custom.spinner';
import { useAppSelector } from '@/modules/store/create-store';

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
                <BooksCarousel slides={viewmodel.mostPopularBooks} withExtraGap title={''} />
              );
      }
    })();

    return nodeToRender;
}
