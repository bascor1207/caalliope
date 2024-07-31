import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksUseCase } from './get-books.usecase';
import { stateBuilder } from './state-builder';
import { Book } from '../connector-to.get-books';

describe('test to retrieve a range of catalog to display', () => {
    it('should retrieve catalog when user go on catalog page', async () => {
        givenConnectedUser(/*true,*/ books);

        await whenUserFetchCatalogPage();

        thenTheUserShouldSeeBooks();
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })
const givenConnectedUser = (/*connectedUser: boolean,*/ books: Book[] ) => {
    //fakeGetBooksAdapter.connectedUser = connectedUser;
    fakeGetBooksAdapter.returnedResponse  = books;
}

const whenUserFetchCatalogPage = async () => {
    //const connectedUser = fakeGetBooksAdapter.connectedUser;
    await store.dispatch(getBooksUseCase(/*{ connectedUser }*/));
}
const thenTheUserShouldSeeBooks = (): void => {
    const state = stateBuilder().withSuccess({
        //connectedUser: true,
        books,
        }).build();
    expect(state).toEqual(store.getState())
};

const books: Book[] = [
    {
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
        type: 'Novel',
        subject: [
            {
                subject: {
                    id: 1,
                    label: 'Fantasy Medieval'
                }
            }
        ],
        dateOfPublication: '2023',
        image: 'test'
    }
];
