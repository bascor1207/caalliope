'use client'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BookInfo } from '@/modules/books/get-one-book/ui/components/Book-info';
import { AppDispatch } from '@/modules/store/create-store';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

const BookInfoPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(getOneBookById(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BookInfo />
    </div>
  );
};

export default BookInfoPage;