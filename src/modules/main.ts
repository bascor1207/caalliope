import {
    AppStore,
    createStore,
    Dependencies,
} from '@/modules/store/create-store';
import { FakeGetBooksGateway } from "@/modules/books/get-books/infra/fake-get-books-gateway";
import { catalog } from "@/modules/catalog";
import { FakeGetOneBookGateway } from "@/modules/books/get-one-book/infra/fake-get-one-book.gateway";
import { initLocale } from '@/i18n';

const book = {
    id: '1',
    title: 'Le seigneur des anneaux',
    author: 'Laura bojon',
}


export class App {
    public dependencies: Dependencies;
    public store: AppStore;

    constructor() {
        initLocale();
        this.dependencies = this.setupDependencies();
        this.store = createStore(this.dependencies);
    }

    setupDependencies(): Dependencies {
        const getBooksAdapter = new FakeGetBooksGateway();
        getBooksAdapter.returnedResponse = catalog;
        getBooksAdapter.connectedUser = true;

        const getOneBookAdapter = new FakeGetOneBookGateway();
        getOneBookAdapter.returnedResponse = book;

        return {
            getBooksAdapter,
            getOneBookAdapter
        };
    }
}

export const app = new App();
