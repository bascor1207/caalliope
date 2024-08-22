import { RootState } from '@/modules/store/create-store';
import { selectBooks } from '@/modules/books/get-books/core/get-books.selectors';

export const getBooksByAuthorViewmodel = (query: string) => (state: RootState) => {
  const books = selectBooks(state);

  return books.filter((book) => book.author.lastname.toLowerCase().includes(query.toLowerCase()));
}
