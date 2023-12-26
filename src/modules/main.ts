import {
    AppStore,
    createStore,
    Dependencies,
} from '@/modules/store/create-store';
import {FakeGetBooksGateway} from "@/modules/catalog/get-books/infra/fake-get-books-gateway";
import {catalog} from "@/modules/catalog";


export class App {
    public dependencies: Dependencies;
    public store: AppStore;

    constructor() {
        this.dependencies = this.setupDependencies();
        this.store = createStore(this.dependencies);
    }

    setupDependencies(): Dependencies {
        const getBooksAdapter = new FakeGetBooksGateway();
        getBooksAdapter.returnedResponse = catalog;
        getBooksAdapter.connectedUser = true;
        return {
            getBooksAdapter: getBooksAdapter,
        };
    }
}

export const app = new App();
