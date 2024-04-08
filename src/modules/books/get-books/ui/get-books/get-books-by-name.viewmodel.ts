import { RootState } from '@/modules/store/create-store';

const selectState = (state: RootState) => ( state.catalog.getBooks.books );
export const getBooksByNameViewmodel = (query: string) => (state: RootState) => {
  const booksState = selectState(state);

  return booksState.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
}