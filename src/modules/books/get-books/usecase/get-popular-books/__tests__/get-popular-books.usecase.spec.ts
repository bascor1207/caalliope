import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { createTestStore } from '@/modules/store/create-store';
import { Book } from '../../../connector-to.get-books';
import { getPopularBooksUseCase } from '../get-popular-books.usecase';
import { stateBuilder } from './state-builder';

describe('test to retrieve a list of popular books', () => {
    it('should retrieve a list of popular books', async () => {
        givenWantingToRetrievePopularBooks(books);

        await whenRetrievingPopularBooks();

        thenTheUserShouldSeePopularBooks(books);
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })

const givenWantingToRetrievePopularBooks = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse  = payload;
}

const whenRetrievingPopularBooks = async () => {
    await store.dispatch(getPopularBooksUseCase());
}
const thenTheUserShouldSeePopularBooks = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: Book[] = [
    {
        id: 1,
        title: 'novel title',
        author: 'Bastien Corré',
        type: 'Novel',
        subject: 'Fantasy Medieval',
        image: 'test',
        dateOfPublication: '2023'
    }
];
