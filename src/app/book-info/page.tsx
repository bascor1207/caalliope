'use client'

import { BookInfo } from '@/modules/books/get-one-book/ui/components/Book-info';
import { TabBookInfo } from '@/modules/books/get-one-book/ui/components/tab-book-info';

const BookInfoPage = () => {
  return (
    <div>
      <BookInfo />
      <TabBookInfo />
    </div>
  );
};

export default BookInfoPage;