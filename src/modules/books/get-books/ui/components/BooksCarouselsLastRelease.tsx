'use client'
import { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/modules/store/create-store';
import { getBooksLastReleaseUseCase } from '../../usecase/get-books-last-release/get-books-last-release.usecase';
import { getBooksLastReleaseViewmodel } from '@/modules/books/get-books/ui/books-last-release-carousel/get-books-last-release.viewmodel';
import BooksCarousel from './BooksCarousel';

export const BooksCarouselsLastRelease = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getBooksLastReleaseUseCase());
  }, []);

  const viewmodel = useSelector(getBooksLastReleaseViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingBooksLastReleasePending':
              return <div>Loading...</div>;
          case 'gettingBooksLastReleaseRejected':
              return <div>Oops...</div>;
          case 'gettingBooksLastReleaseFulfilled':
              return (
                <BooksCarousel slides={viewmodel.books} withExtraGap title={'title'} />
              );
      }
  })();

  return nodeToRender;
}