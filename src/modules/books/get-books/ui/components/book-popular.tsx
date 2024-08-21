'use client'
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { getPopularBooksViewmodel } from '../get-popular-books/get-popular-books.viewmodel';
import BooksCarousel from '@/modules/books/get-books/ui/components/books-carousel';
import { CustomSpinner } from '@/modules/ui/app-level/custom.spinner';

export const PopularBooksCarousels = () => {
  const viewmodel = useSelector(getPopularBooksViewmodel());

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
