import {
    UnknownAction,
    configureStore,
    ThunkDispatch,
    MiddlewareAPI,
    ListenerMiddlewareInstance
} from '@reduxjs/toolkit';
import { rootReducer } from '@/modules/app/core/store/root-reducer';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { ConnectorToGetOneBook } from '@/modules/books/get-one-book/connector-to.get-one-book';
import { ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';
import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { CookiesInterface } from '@/modules/app/core/cookies.interface';
import { FakeCookiesProvider } from '@/modules/app/core/fake-cookies.provider';
import {
    registerOnAuthChangeForUserListener, registerOnBookCreationErrorForUserListener,
    registerOnBookCreationSuccessForUserListener
} from '@/modules/user/core/store/user.listeners';
import { listenerMiddleware } from '@/modules/app/core/store/create-app-listener';
import { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';

export type Dependencies = {
    getBooksAdapter: ConnectorToGetBooks;
    getOneBookAdapter: ConnectorToGetOneBook;
    createBookAdapter: ConnectorToCreateBookGateway;
    authAdapter: ConnectorToAuthGateway;
    userAdapter: ConnectorToUserGateway;
    cookiesAdapter: CookiesInterface;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>,
) => {
  return configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
        registerOnAuthChangeForUserListener();
        registerOnBookCreationSuccessForUserListener();
        registerOnBookCreationErrorForUserListener();
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }).prepend(listenerMiddleware.middleware)
    },
    preloadedState,
  });
};

export const createTestStore = (
  {
    getBooksAdapter = new FakeGetBooksGateway(),
    getOneBookAdapter = new FakeGetOneBookGateway(),
    createBookAdapter = new FakeCreateBookGateway(),
    authAdapter = new FakeAuthGateway(),
    userAdapter = new FakeUserGateway(),
    cookiesAdapter = new FakeCookiesProvider()
  }: Partial<Dependencies> = {},
  preloadedState?: DeepPartial<ReturnType<typeof rootReducer>>,
) => {
  return createStore({ getBooksAdapter, getOneBookAdapter, createBookAdapter, authAdapter, userAdapter, cookiesAdapter }, preloadedState as never);
};

export const createTestState = (partialState?: DeepPartial<RootState>) => {
  const store = createStore(createDependencies())

  const storeInitialState = store.getState()

  const merged = {
    ...storeInitialState,
    ...partialState,
  }

  return createTestStore({}, merged).getState()
}

const createDependencies = (
    dependencies?: DeepPartial<Dependencies>,
): Dependencies =>
    ({
      authAdapter: new FakeAuthGateway(),
      ...dependencies,
    }) as Dependencies;


type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
export type AppListenerMiddlewareInstance = ListenerMiddlewareInstance<MiddlewareAPI<AppDispatch, RootState>>;


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
