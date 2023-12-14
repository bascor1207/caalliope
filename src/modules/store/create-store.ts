import { UnknownAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { rootReducer } from '@/modules/store/root-reducer';
import { FakeGetBooksGateway } from "@/modules/catalog/get-books/infra/fake-get-books-gateway";

export type Dependencies = {
  getBooksAdapter: GetBooksAdapter;
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
  { getBooksAdapter = new FakeGetBooksGateway() }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>,
) => {
  return createStore({ getBooksAdapter }, preloadedState);
};
type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
