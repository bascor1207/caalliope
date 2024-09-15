import type { AppStore, Dependencies, RootState } from '@/modules/app/core/store/create-store';

import { createStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { catalog } from '@/modules/catalog';

// TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';
import { HttpGetOneBookGateway } from '@/modules/books/get-one-book/infra/http-get-one-book.gateway';
import { HttpGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/http-get-books.gateway';
import { HttpDonateGateway } from '@/modules/donate/infra/http-donate.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';


//TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL

import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
// import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
import { FakeCreateEditionGateway } from '@/modules/books/usecases/create-edition/infra/fake-create-edition.gateway';
// import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';
import { FakeGetLastReleaseBooksGateway } from '@/modules/books/usecases/get-last-release-books/infra/fake-get-last-release-books.gateway';
import { FakeGetPopularBooksGateway } from '@/modules/books/usecases/get-popular-books/infra/fake-get-popular-books.gateway';
import { FakeUpdateBookGateway } from '@/modules/books/usecases/update-book/infra/fake-update-book.gateway';
import { FakeUpdateEditionGateway } from '@/modules/books/usecases/update-edition/infra/fake-update-edition.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';
import { FakeAdminGateway } from '@/modules/user/usecases/admin/infra/fake-admin.gateway';



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
        // const getBooksAdapter = new HttpGetBooksGateway();
        const getOneBookAdapter = new HttpGetOneBookGateway();
        const getBooksAdapter = new HttpGetBooksGateway();
        // const getOneBookAdapter = new HttpGetOneBookGateway();
        const cookiesAdapter = new HttpCookiesProvider();
        const donateAdapter = new HttpDonateGateway();


        //TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
        const authAdapter = new FakeAuthGateway();
        const userAdapter = new FakeUserGateway();
        const adminAdapter = new FakeAdminGateway();
        // const getOneBookAdapter = new FakeGetOneBookGateway();
        // getOneBookAdapter.returnedResponse = book;
        // const getBooksAdapter = new FakeGetBooksGateway(500);
        // getBooksAdapter.returnedResponse = catalog;
        const createBookAdapter = new FakeCreateBookGateway();

        const getPopularBooksAdapter = new FakeGetPopularBooksGateway();
        getPopularBooksAdapter.returnedResponse = catalog;
        const getLastReleaseBooksAdapter = new FakeGetLastReleaseBooksGateway();
        getLastReleaseBooksAdapter.returnedResponse = catalog;

        const createEditionAdapter = new FakeCreateEditionGateway();
        const updateBookAdapter = new FakeUpdateBookGateway();
        const updateEditionAdapter = new FakeUpdateEditionGateway();

        return {
            getBooksAdapter,
            getPopularBooksAdapter,
            getLastReleaseBooksAdapter,
            getOneBookAdapter,
            authAdapter,
            userAdapter,
            adminAdapter,
            cookiesAdapter,
            donateAdapter,
            createBookAdapter,
            createEditionAdapter,
            updateEditionAdapter,
            updateBookAdapter
        };
    }
}

export const ssrApp = new SSRApp();
