import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';

import styles from './book-list-by-subject.module.scss';
import { getBooksViewModel } from '../get-books/get-books.viewmodel';
import { getBooksBySubjectUtils } from '../get-books/get-books-by-subject.utils';
import { NoResults } from './no-results';
import { BookCardCatalog } from './book-card-catalog';

type BooksListBySubjectProps = {
    subject: string;
};

export const BooksListBySubject: FC<BooksListBySubjectProps> = ({ subject }: BooksListBySubjectProps) => {
  const viewmodel = useSelector(getBooksViewModel());

  const nodeToRender: ReactNode = (() => {
    switch (viewmodel.type) {
      case 'gettingBooksPending':
        return <div>Loading...</div>;
      case 'gettingBooksRejected':
        return <div>Oops...</div>;
      case 'gettingBooksFulfilled': {
        const filteredBooks = getBooksBySubjectUtils(viewmodel.books, subject);
        if (filteredBooks.length === 0) {
          return <NoResults />;
        }
        return (
          <div className={styles.list}>
            {filteredBooks.map((book) => (
              <BookCardCatalog
                key={book.id}
                book={book}
              />
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  })();

  return nodeToRender;
};