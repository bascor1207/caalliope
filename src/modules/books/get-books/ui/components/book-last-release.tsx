'use client'
import { ReactNode } from 'react';
import { useGetBooksLastReleaseViewmodel } from '../get-last-release-books/get-last-release-books.viewmodel';
import { CustomSpinner } from '@/modules/ui/app-level/custom.spinner';
import BooksCarousel from '@/modules/books/get-books/ui/components/books-carousel';

export const BooksCarouselsLastRelease = () => {
  const viewmodel = useGetBooksLastReleaseViewmodel();

  const nodeToRender: ReactNode = (() => {
      switch (viewmodel.type) {
          case 'gettingBooksLastReleasePending':
              return <CustomSpinner />;
          case 'gettingBooksLastReleaseRejected':
              return <div>Oops...</div>;
          case 'gettingBooksLastReleaseFulfilled':
              return (
                <BooksCarousel slides={viewmodel.lastReleaseBooks} withExtraGap />
              );
      }
  })();

  return nodeToRender;
}
