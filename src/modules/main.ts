import {
    AppStore,
    createStore,
    Dependencies,
} from '@/modules/store/create-store';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { catalog } from '@/modules/catalog';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { initLocale } from '@/i18n';
import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';

const book = {
    id: 1,
    title: 'novel title',
    author: {
        id: 1,
        lastname: 'Medieval',
        firstname: 'Bastien',
        image: 'test',
        email: 'test',
        birthDate: 'test'
    },
    summary: 'summary test',
    type: 'Novel',
    subjects: [
        {
            id: 1,
            label: 'Fantasy Medieval'
        }
    ],
    publishing: [
        {
            publishingHouse: {
                id: 1,
                label: 'Lumen',
                language: 'Français',
                numberOfPages: 684,
                dateofPublication: '2023'
            }
        }
    ],
    reviews: [
        {
            review: {
                id: 1,
                userId: 1,
                comment: 'test',
                date: '2023'
            }
        }
    ],
    rating: 4.5,
    dateOfPublication: '2023',
    image: '/livre1.jpg'
};


export class App {
    public dependencies: Dependencies;
    public store: AppStore;

    constructor() {
        initLocale();
        this.dependencies = this.setupDependencies();
        this.store = createStore(this.dependencies);
    }

    setupDependencies(): Dependencies {
        const getBooksAdapter = new FakeGetBooksGateway(1000);
        getBooksAdapter.returnedResponse = catalog;
        getBooksAdapter.connectedUser = true;

        const getOneBookAdapter = new FakeGetOneBookGateway();
        getOneBookAdapter.returnedResponse = book;

        const authAdapter = new FakeAuthGateway();

        return {
            getBooksAdapter,
            getOneBookAdapter,
            authAdapter
        };
    }
}

export const app = new App();
