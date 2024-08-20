'use client'
import { ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/modules/store/create-store';
import { getBooksLastReleaseUseCase } from '../../usecase/get-last-release-books/get-last-release-books.usecase';
import { getBooksLastReleaseViewmodel } from '../get-last-release-books/get-last-release-books.viewmodel';
import BooksCarousel from './BooksCarousel';
import { CustomSpinner } from '@/modules/ui/app-level/custom.spinner';

export const BooksCarouselsLastRelease = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getBooksLastReleaseUseCase());
  }, []);

  const viewmodel = useSelector(getBooksLastReleaseViewmodel());

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingBooksLastReleasePending':
              return <CustomSpinner />;
          case 'gettingBooksLastReleaseRejected':
              return <div>Oops...</div>;
          case 'gettingBooksLastReleaseFulfilled':
              return (
                <BooksCarousel slides={viewmodel.books} withExtraGap />
              );
      }
  })();

  return nodeToRender;
}
