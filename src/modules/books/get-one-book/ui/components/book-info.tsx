'use client';
import type { ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store'
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { BookInfoCard } from '@/modules/books/get-one-book/ui/components/book-info-card';
import { TabBookInfo } from '@/modules/books/get-one-book/ui/components/tab-book-info';
import { getOneBookViewmodel } from '@/modules/books/get-one-book/ui/get-one-book.viewmodel';



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
