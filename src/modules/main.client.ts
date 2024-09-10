import type { AppStore, Dependencies, RootState } from '@/modules/app/core/store/create-store';


import { initLocale } from '@/i18n';
import { createStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { catalog } from '@/modules/catalog';

// TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';
// import { HttpCreateBookGateway } from '@/modules/books/usecases/create-book/infra/http-create-book.gateway';
// import { HttpAuthGateway } from '@/modules/auth/infra/http-auth.gateway';
import { HttpGetOneBookGateway } from '@/modules/books/get-one-book/infra/http-get-one-book.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';
import { HttpGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/http-get-books.gateway';
import { HttpDonateGateway } from '@/modules/donate/infra/http-donate.gateway';
// import { HttpGetOneBookGateway } from '@/modules/books/get-one-book/infra/http-get-one-book.gateway';
// import { HttpUserGateway } from '@/modules/user/infra/http-user.gateway';
// import { HttpGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/http-get-books.gateway';


//TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';
// import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
import { FakeCreateEditionGateway } from '@/modules/books/usecases/create-edition/infra/fake-create-edition.gateway';
// import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';
import { FakeGetLastReleaseBooksGateway } from '@/modules/books/usecases/get-last-release-books/infra/fake-get-last-release-books.gateway';
import { FakeGetPopularBooksGateway } from '@/modules/books/usecases/get-popular-books/infra/fake-get-popular-books.gateway';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';

// const book = BookFactory.create();

export class App {
    public dependencies: Dependencies;
    public store: AppStore;

    constructor(initialState?: RootState) {
        initLocale();
        this.dependencies = this.setupDependencies();
        this.store = createStore(this.dependencies, initialState);
    }

    setupDependencies(): Dependencies {


        // TODO UNCOMMENT THIS WHEN WANTING BACK WITH FRONT
        // const authAdapter = new HttpAuthGateway();
        // const userAdapter = new HttpUserGateway()
        const getBooksAdapter = new HttpGetBooksGateway();
        const getOneBookAdapter = new HttpGetOneBookGateway();
        const donateAdapter = new HttpDonateGateway();
        // const getBooksAdapter = new HttpGetBooksGateway();
        // const getOneBookAdapter = new HttpGetOneBookGateway();
        const cookiesAdapter = new HttpCookiesProvider();
        // const createBookAdapter = new HttpCreateBookGateway();


        //TODO UNCOMMENT THIS WHEN WANTING ONY LOCAL
        const authAdapter = new FakeAuthGateway();
        const userAdapter = new FakeUserGateway();
        // const getOneBookAdapter = new FakeGetOneBookGateway();
        // getOneBookAdapter.returnedResponse = book;
        // const getBooksAdapter = new FakeGetBooksGateway(1000);
        // getBooksAdapter.returnedResponse = catalog;
        const createBookAdapter = new FakeCreateBookGateway();
        const createEditionAdapter = new FakeCreateEditionGateway();

        const getPopularBooksAdapter = new FakeGetPopularBooksGateway();
        getPopularBooksAdapter.returnedResponse = catalog;
        const getLastReleaseBooksAdapter = new FakeGetLastReleaseBooksGateway();
        getLastReleaseBooksAdapter.returnedResponse = catalog;


        return {
            getBooksAdapter,
            getPopularBooksAdapter,
            getLastReleaseBooksAdapter,
            getOneBookAdapter,
            authAdapter,
            userAdapter,
            donateAdapter,
            cookiesAdapter,
            createBookAdapter,
            createEditionAdapter
        };
    }
}

export const clientApp = (initialState: RootState) => new App(initialState);
