import { createSelector } from 'reselect';
import { RootState } from '@/modules/store/create-store';
import { Book } from '../../connector-to.get-books';

const selectBooks = (state: RootState) => state.catalog.getBooks.books;

export const getBooksByNameViewmodel = (query: string) =>
  createSelector(
    [selectBooks],
    (booksState) => {
      if (!booksState || !Array.isArray(booksState)) {
        return [];
      }

      return booksState.filter((book: Book) =>
        book.title && book.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  );