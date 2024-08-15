import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { getBooksViewModel } from '../get-books/get-books.viewmodel';
import { getBooksBySubjectUtils } from '../get-books/get-books-by-subject.utils';
import { NoResults } from './no-results';
import { BooksCatalog } from './book-card-catalog';
import { Loader } from '@/components/ui/loader';

type BooksListBySubjectProps = {
    subject: string;
};

export const BooksListBySubject: FC<BooksListBySubjectProps> = ({ subject }: BooksListBySubjectProps) => {
  const viewmodel = useSelector(getBooksViewModel());

  const nodeToRender: ReactNode = (() => {
    switch (viewmodel.type) {
      case 'gettingBooksPending':
        return <Loader />;
      case 'gettingBooksRejected':
        return <div>Oops...</div>;
      case 'gettingBooksFulfilled': {
        const filteredBooks = getBooksBySubjectUtils(viewmodel.books, subject);
        if (filteredBooks.length === 0) {
          return <NoResults />;
        }
        return (
         <BooksCatalog books={filteredBooks} />
        );
      }
      default:
        return null;
    }
  })();

  return nodeToRender;
};
