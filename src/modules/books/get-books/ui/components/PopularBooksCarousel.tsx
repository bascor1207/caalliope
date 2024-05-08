'use client'
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPopularBooksViewmodel } from '../popular-books-carousel/get-popular-books.viewmodel';
import { getPopularBooksUseCase } from '../../usecase/get-popular-books/get-popular-books.usecase';
import { AppDispatch } from '@/modules/store/create-store';
import BooksCarousel from './BooksCarousel';

export const PopularBooksCarousels = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getPopularBooksUseCase);
  }, []);
  
  const viewmodel = useSelector(getPopularBooksViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingPopularBooksPending':
              return <div>Loading...</div>;
          case 'gettingPopularBooksRejected':
              return <div>Oops...</div>;
          case 'gettingPopularBooksFulfilled':
              return (
                <BooksCarousel slides={viewmodel.books} withExtraGap title={'title'} />
              );
      }
  })();

  return nodeToRender;
}