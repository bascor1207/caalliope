import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';

import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';

import { stateBuilder } from './state-builder';
import { getBooksLastReleaseUseCase } from '../get-last-release-books.usecase';


describe('test to retrieve a list of last release books', () => {
    it('should retrieve a list of last release books', async () => {
        givenWantingToRetrieveBooksLastRelease(books);

        await whenRetrievingBooksLastRelease();

        thenTheUserShouldSeeBooksLastRelease(books);
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })

const givenWantingToRetrieveBooksLastRelease = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse  = payload;
}

const whenRetrievingBooksLastRelease = async () => {
    await store.dispatch(getBooksLastReleaseUseCase());
}
const thenTheUserShouldSeeBooksLastRelease = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: BooksModel.Book[] = [BookFactory.create()]
