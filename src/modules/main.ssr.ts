import type { AppStore, Dependencies, RootState } from '@/modules/app/core/store/create-store';

import { createStore } from '@/modules/app/core/store/create-store';
import { catalog } from '@/modules/catalog';

// TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
// import { HttpAuthGateway } from '@/modules/auth/infra/http-auth.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';
// import { HttpGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';
import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

//TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
import { FakeCreateEditionGateway } from '@/modules/books/usecases/create-edition/infra/fake-create-edition.gateway';
import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';
import { FakeGetLastReleaseBooksGateway } from '@/modules/books/usecases/get-last-release-books/infra/fake-get-last-release-books.gateway';
import { FakeGetPopularBooksGateway } from '@/modules/books/usecases/get-popular-books/infra/fake-get-popular-books.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';

import { BookFactory } from './books/model/books.factory';


const book = BookFactory.create();

export class SSRApp {
    public dependencies: Dependencies;
    public store: AppStore;

    constructor(initialState?: RootState) {
        this.dependencies = this.setupDependencies();
        this.store = createStore(this.dependencies, initialState);
    }

    setupDependencies(): Dependencies {


        // TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
        // const authAdapter = new HttpAuthGateway();
        // const userAdapter = new HttpUserGateway();
        // const getBooksAdapter = new HttpGetBooksGateway()
        const cookiesAdapter = new HttpCookiesProvider();


        //TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
        const authAdapter = new FakeAuthGateway();
        const userAdapter = new FakeUserGateway();
        const getOneBookAdapter = new FakeGetOneBookGateway();
        getOneBookAdapter.returnedResponse = book;
        const getBooksAdapter = new FakeGetBooksGateway(500);
        getBooksAdapter.returnedResponse = catalog;
        const createBookAdapter = new FakeCreateBookGateway();

        const getPopularBooksAdapter = new FakeGetPopularBooksGateway();
        const getLastReleaseBooksAdapter = new FakeGetLastReleaseBooksGateway();

        const createEditionAdapter = new FakeCreateEditionGateway();

        return {
            getBooksAdapter,
            getPopularBooksAdapter,
            getLastReleaseBooksAdapter,
            getOneBookAdapter,
            authAdapter,
            userAdapter,
            cookiesAdapter,
            createBookAdapter,
            createEditionAdapter
        };
    }
}

export const ssrApp = new SSRApp();
