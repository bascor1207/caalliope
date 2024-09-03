import type { RootState } from '@/modules/app/core/store/create-store';

import { selectBooks } from '@/modules/books/usecases/get-catalog/core/get-books.selectors';

export const getBooksByAuthorViewmodel = (query: string) => (state: RootState) => {
  const books = selectBooks(state);

  return books.filter((book) => book.author.lastname.toLowerCase().includes(query.toLowerCase()));
}
