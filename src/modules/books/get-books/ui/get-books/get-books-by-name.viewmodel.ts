import { RootState } from '@/modules/store/create-store';
import { Book } from '../../connector-to.get-books';

const selectState = (state: RootState) => ( state.catalog.getBooks.books );
export const getBooksByNameViewmodel = (query: string) => (state: RootState) => {
  const booksState = selectState(state);
  console.log('books state', booksState)
  return booksState.filter((book: Book) => 
    book.title && book.title.toLowerCase().includes(query.toLowerCase())
);
}