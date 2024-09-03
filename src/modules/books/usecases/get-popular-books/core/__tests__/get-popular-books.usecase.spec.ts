import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-popular-books/core/__tests__/state-builder';
import { getPopularBooksUseCase } from '@/modules/books/usecases/get-popular-books/core/get-popular-books.usecase';

import { FakeGetPopularBooksGateway } from '@/modules/books/usecases/get-popular-books/infra/fake-get-popular-books.gateway';



describe('test to retrieve a list of popular books', () => {
    it('should retrieve a list of popular books', async () => {
        givenWantingToRetrievePopularBooks(books);

        await whenRetrievingPopularBooks();

        thenTheUserShouldSeePopularBooks(books);
    })
});

const fakeGetBooksAdapter = new FakeGetPopularBooksGateway();
const store = createTestStore({ getPopularBooksAdapter: fakeGetBooksAdapter })

const givenWantingToRetrievePopularBooks = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse = payload;
}

const whenRetrievingPopularBooks = async () => {
    await store.dispatch(getPopularBooksUseCase());
}
const thenTheUserShouldSeePopularBooks = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: BooksModel.Book[] = [BookFactory.create()]
