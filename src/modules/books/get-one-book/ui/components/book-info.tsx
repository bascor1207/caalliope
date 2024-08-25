'use client';
import { ReactNode } from 'react';
import { useAppSelector } from '@/modules/store/create-store'

import { getOneBookViewmodel } from '../get-one-book.viewmodel';
import { BookInfoCard } from './book-info-card';
import { TabBookInfo } from './tab-book-info';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';

export const BookInfo = () => {
  const viewmodel = useAppSelector(getOneBookViewmodel());

  const nodeToRender: ReactNode = (() => {
    switch (viewmodel.type) {
    case 'pending':
      return <CustomSpinner />;
    case 'gettingBookRejected':
      return <div>Oops...</div>;
    case 'fulfilled':
      return (
        <div>
          <div className='mb-20'>
            <BookInfoCard book={viewmodel.selectedBook} />
          </div>
            <TabBookInfo book={viewmodel.selectedBook} />
        </div>
      );
    }
  })();
  return nodeToRender;
};
