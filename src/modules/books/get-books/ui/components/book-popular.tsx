'use client'
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPopularBooksViewmodel } from '../get-popular-books/get-popular-books.viewmodel';
import { getPopularBooksUseCase } from '../../usecase/get-popular-books/get-popular-books.usecase';
import { AppDispatch } from '@/modules/store/create-store';
import BooksCarousel from '@/modules/books/get-books/ui/components/books-carousel';
import { CustomSpinner } from '@/modules/ui/app-level/custom.spinner';

export const PopularBooksCarousels = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getPopularBooksUseCase);
  }, []);

  const viewmodel = useSelector(getPopularBooksViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingPopularBooksPending':
              return <CustomSpinner />;
          case 'gettingPopularBooksRejected':
              return <div>Oops...</div>;
          case 'gettingPopularBooksFulfilled':
              return (
                <BooksCarousel slides={viewmodel.books} withExtraGap title={''} />
              );
      }
  })();

  return nodeToRender;
}
