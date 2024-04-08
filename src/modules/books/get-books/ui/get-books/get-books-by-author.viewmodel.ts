import { RootState } from '@/modules/store/create-store';

const selectState = (state: RootState) => ( state.catalog.getBooks.books );
export const getBookByAuthorViewmodel = (query: string) => (state: RootState) => {
  const booksState = selectState(state);

  return booksState.filter((book) => book.author.lastname.toLowerCase().includes(query.toLowerCase()));
}