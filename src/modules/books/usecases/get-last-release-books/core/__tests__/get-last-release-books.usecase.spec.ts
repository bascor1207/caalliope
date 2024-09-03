import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-last-release-books/core/__tests__/state-builder';
import { getBooksLastReleaseUseCase } from '@/modules/books/usecases/get-last-release-books/core/get-last-release-books.usecase';

import { FakeGetLastReleaseBooksGateway } from '@/modules/books/usecases/get-last-release-books/infra/fake-get-last-release-books.gateway';

describe('test to retrieve a list of last release books', () => {
    it('should retrieve a list of last release books', async () => {
        givenWantingToRetrieveBooksLastRelease(books);

        await whenRetrievingBooksLastRelease();

        thenTheUserShouldSeeBooksLastRelease(books);
    })
});

const fakeGetLastReleaseBooks = new FakeGetLastReleaseBooksGateway();
const store = createTestStore({ getLastReleaseBooksAdapter: fakeGetLastReleaseBooks })

const givenWantingToRetrieveBooksLastRelease = (payload: typeof books) => {
    fakeGetLastReleaseBooks.returnedResponse  = payload;
}

const whenRetrievingBooksLastRelease = async () => {
    await store.dispatch(getBooksLastReleaseUseCase());
}
const thenTheUserShouldSeeBooksLastRelease = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: BooksModel.Book[] = [BookFactory.create()]
