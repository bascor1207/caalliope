import type { RootState } from '@/modules/app/core/store/create-store';

import { selectBooks } from '@/modules/books/usecases/get-catalog/core/store/get-books.selectors';


export const getBooksByNameViewmodel = (query: string) => (state: RootState) => {
  const books = selectBooks(state);

  return books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
};
