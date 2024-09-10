import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import type { CookiesInterface } from '@/modules/app/core/cookies.interface';
import type { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import type { ConnectorToGetOneBook } from '@/modules/books/get-one-book/core/connector-to.get-one-book';
import type { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';
import type { ConnectorToCreateEditionGateway } from '@/modules/books/usecases/create-edition/core/connector-to-create-edition.gateway';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';
import type { ConnectorToLastReleaseBooks } from '@/modules/books/usecases/get-last-release-books/core/connector-to-last-release-books';
import type { ConnectorToPopularBooks } from '@/modules/books/usecases/get-popular-books/core/connector-to-popular-books.gateway';
import type { ConnectorToDonateGateway } from '@/modules/donate/infra/connector-to-donate.gateway';
import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { ConnectorToAdminGateway } from '@/modules/user/usecases/admin/core/connector-to-admin.gateway';
import type {
    UnknownAction,
    ThunkDispatch,
    MiddlewareAPI,
    ListenerMiddlewareInstance
} from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';

import { listenerMiddleware } from '@/modules/app/core/store/create-app-listener';
import { rootReducer } from '@/modules/app/core/store/root-reducer';
import { registerOnDetailsModalDisplayedForBookListener } from '@/modules/books/get-one-book/core/get-book.listeners';
import {
    registerOnAuthChangeForUserListener,
    registerOnBookCreationErrorForUserListener,
    registerOnBookCreationSuccessForUserListener,
    registerOnEditionCreationErrorForUserListener,
    registerOnEditionCreationSuccessForUserListener,
    registerOnUpdatedBookStatusErrorForUserListener,
    registerOnUpdatedBookStatusForUserListener
} from '@/modules/user/core/store/user.listeners';

import { FakeCookiesProvider } from '@/modules/app/infra/fake-cookies.provider';
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
import { FakeCreateEditionGateway } from '@/modules/books/usecases/create-edition/infra/fake-create-edition.gateway';
import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';
import { FakeGetLastReleaseBooksGateway } from '@/modules/books/usecases/get-last-release-books/infra/fake-get-last-release-books.gateway';
import { FakeGetPopularBooksGateway } from '@/modules/books/usecases/get-popular-books/infra/fake-get-popular-books.gateway';
import { FakeDonateGateway } from '@/modules/donate/infra/fake-donate.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';
import { FakeAdminGateway } from '@/modules/user/usecases/admin/infra/fake-admin.gateway';


export type Dependencies = {
    getBooksAdapter: ConnectorToGetBooks;
    getPopularBooksAdapter: ConnectorToPopularBooks;
    getLastReleaseBooksAdapter: ConnectorToLastReleaseBooks;
    getOneBookAdapter: ConnectorToGetOneBook;
    createBookAdapter: ConnectorToCreateBookGateway;
    createEditionAdapter: ConnectorToCreateEditionGateway;
    authAdapter: ConnectorToAuthGateway;
    adminAdapter: ConnectorToAdminGateway;
    userAdapter: ConnectorToUserGateway;
    donateAdapter: ConnectorToDonateGateway;
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
        registerOnEditionCreationSuccessForUserListener();
        registerOnEditionCreationErrorForUserListener();
        registerOnDetailsModalDisplayedForBookListener();
        registerOnUpdatedBookStatusForUserListener();
        registerOnUpdatedBookStatusErrorForUserListener();
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
    getPopularBooksAdapter = new FakeGetPopularBooksGateway(),
    getLastReleaseBooksAdapter = new FakeGetLastReleaseBooksGateway(),
    getOneBookAdapter = new FakeGetOneBookGateway(),
    createBookAdapter = new FakeCreateBookGateway(),
    createEditionAdapter = new FakeCreateEditionGateway(),
    authAdapter = new FakeAuthGateway(),
    adminAdapter = new FakeAdminGateway(),
    userAdapter = new FakeUserGateway(),
    donateAdapter = new FakeDonateGateway(),
    cookiesAdapter = new FakeCookiesProvider()
  }: Partial<Dependencies> = {},
  preloadedState?: DeepPartial<ReturnType<typeof rootReducer>>,
) => {
  return createStore({
      getBooksAdapter, getPopularBooksAdapter, getLastReleaseBooksAdapter, getOneBookAdapter,
      createBookAdapter, createEditionAdapter,
      authAdapter, userAdapter, adminAdapter,
      cookiesAdapter, donateAdapter
}, preloadedState as never);
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
