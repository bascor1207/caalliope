import { UnknownAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { rootReducer } from '@/modules/store/root-reducer';
import { FakeGetBooksGateway } from "@/modules/books/get-books/infra/fake-get-books-gateway";
import { ConnectorToGetOneBook } from "@/modules/books/get-one-book/connector-to.get-one-book";
import { ConnectorToGetBooks } from "@/modules/books/get-books/connector-to.get-books"
import {FakeGetOneBookGateway} from "@/modules/books/get-one-book/infra/fake-get-one-book.gateway";

export type Dependencies = {
  getBooksAdapter: ConnectorToGetBooks;
  getOneBookAdapter: ConnectorToGetOneBook;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>,
) => {
  return configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      });
    },
    preloadedState,
  });
};

export const createTestStore = (
  {
    getBooksAdapter = new FakeGetBooksGateway(),
    getOneBookAdapter = new FakeGetOneBookGateway()
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>,
) => {
  return createStore({ getBooksAdapter, getOneBookAdapter }, preloadedState);
};
type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
