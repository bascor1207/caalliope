import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-catalog/core/__tests__/state-builder';
import { getBooksUseCase } from '@/modules/books/usecases/get-catalog/core/get-books.usecase';

import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';



describe('test to retrieve a range of catalog to display', () => {
    it('should retrieve catalog when user go on catalog page', async () => {
        givenConnectedUser(books);

        await whenUserFetchCatalogPage();

        thenTheUserShouldSeeBooks();
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })
const givenConnectedUser = (books: BooksModel.Book[] ) => {
    fakeGetBooksAdapter.returnedResponse  = books;
}

const whenUserFetchCatalogPage = async () => {
    await store.dispatch(getBooksUseCase());
}
const thenTheUserShouldSeeBooks = (): void => {
    const state = stateBuilder().withSuccess({
        books,
        }).build();
    expect(state).toEqual(store.getState())
};

const books: BooksModel.Book[] = [BookFactory.create()]
