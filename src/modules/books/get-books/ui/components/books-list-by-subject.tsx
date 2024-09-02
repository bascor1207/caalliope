import type { FC, ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store'
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { AddBookForm } from '@/modules/books/usecases/create-book/ui/forms/add-book-form';
import { CreateBookPage } from '@/modules/books/usecases/create-book/ui/pages/create-book.page';

import { BooksCatalog } from './book-card-catalog';
import { getBooksBySubjectUtils } from '../get-books/get-books-by-subject.utils';
import { getBooksViewModel } from '../get-books/get-books.viewmodel';

type BooksListBySubjectProps = {
    subject: string;
};

export const BooksListBySubject: FC<BooksListBySubjectProps> = ({ subject }: BooksListBySubjectProps) => {
  const viewmodel = useAppSelector(getBooksViewModel());

  const nodeToRender: ReactNode = (() => {
    switch (viewmodel.type) {
      case 'gettingBooksPending':
        return <CustomSpinner />;
      case 'gettingBooksRejected':
        return <div>Oops...</div>;
      case 'gettingBooksFulfilled': {
        const filteredBooks = getBooksBySubjectUtils(viewmodel.books, subject);
        if (filteredBooks.length === 0) {
          return (
              <CreateBookPage>
                <AddBookForm />
              </CreateBookPage>
          );
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
