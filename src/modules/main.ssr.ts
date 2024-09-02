import type { AppStore, Dependencies, RootState } from '@/modules/app/core/store/create-store';

import { createStore } from '@/modules/app/core/store/create-store';
import { catalog } from '@/modules/catalog';

// TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
// import { HttpAuthGateway } from '@/modules/auth/infra/http-auth.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';
// import { HttpGetBooksGateway } from '@/modules/books/get-books/infra/http-get-books-gateway';
import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

//TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
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
        const getBooksAdapter = new FakeGetBooksGateway(1000);
        getBooksAdapter.returnedResponse = catalog;
        getBooksAdapter.connectedUser = true;
        const createBookAdapter = new FakeCreateBookGateway();

        return {
            getBooksAdapter,
            getOneBookAdapter,
            authAdapter,
            userAdapter,
            cookiesAdapter,
            createBookAdapter
        };
    }
}

export const ssrApp = new SSRApp();
