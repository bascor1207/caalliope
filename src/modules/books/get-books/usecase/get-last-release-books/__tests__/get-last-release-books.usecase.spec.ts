import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksLastReleaseUseCase } from '../get-last-release-books.usecase';
import { stateBuilder } from './state-builder';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '@/modules/books/model/books.factory';

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
