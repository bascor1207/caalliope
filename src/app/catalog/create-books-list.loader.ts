import { getBooksUseCase } from '@/modules/books/get-books/usecase/get-books.usecase';
import { AppStore } from '@/modules/store/create-store';
import { LoaderFunction } from 'react-router-dom';

export const createBooksListLoader = ({ store }: { store: AppStore }): LoaderFunction => () => {
  store.dispatch(getBooksUseCase())
  return null
}