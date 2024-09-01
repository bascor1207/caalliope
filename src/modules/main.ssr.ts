import {
    AppStore,
    createStore,
    Dependencies, RootState,
} from '@/modules/app/core/store/create-store';

// TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
// import { HttpAuthGateway } from '@/modules/auth/infra/http-auth.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';
// import { HttpGetBooksGateway } from '@/modules/books/get-books/infra/http-get-books-gateway';

//TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { catalog } from '@/modules/catalog';

import { CookiesProvider } from '@/modules/app/core/cookies.provider';
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


        //TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
        const authAdapter = new FakeAuthGateway();
        const userAdapter = new FakeUserGateway();
        const getOneBookAdapter = new FakeGetOneBookGateway();
        getOneBookAdapter.returnedResponse = book;
        const getBooksAdapter = new FakeGetBooksGateway(1000);
        getBooksAdapter.returnedResponse = catalog;
        getBooksAdapter.connectedUser = true;




        const cookiesAdapter = new CookiesProvider();

        return {
            getBooksAdapter,
            getOneBookAdapter,
            authAdapter,
            userAdapter,
            cookiesAdapter
        };
    }
}

export const ssrApp = new SSRApp();
