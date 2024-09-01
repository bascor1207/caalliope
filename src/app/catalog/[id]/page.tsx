'use client';

import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';

import { BookInfo } from '@/modules/books/get-one-book/ui/components/book-info';
import { AppDispatch } from '@/modules/app/core/store/create-store';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

const BookInfoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const id = pathname.substring(pathname.lastIndexOf('/') + 1);

  if (id) {
    dispatch(getOneBookById(parseInt(id)))
  }

  return (
      <div>
        <BookInfo />
      </div>
  );
};

export default BookInfoPage;
