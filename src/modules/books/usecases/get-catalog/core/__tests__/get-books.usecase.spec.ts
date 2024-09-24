import { describe, test, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-catalog/core/__tests__/state-builder';
import { getBooksByUsecase } from '@/modules/books/usecases/get-catalog/core/get-books-by.usecase';
import { getBooksUseCase } from '@/modules/books/usecases/get-catalog/core/get-books.usecase';

import { FakeGetBooksGateway } from '@/modules/books/usecases/get-catalog/infra/fake-get-books.gateway';

describe('test to retrieve a range of catalog to display', () => {
    test('should retrieve catalog when user go on catalog page', async () => {
        givenBooks(books);

        await whenUserFetchCatalogPage();

        thenTheUserShouldSeeBooks();
    });

    test('should retrieve catalog by genre when user filters a genre', async () => {
        givenBooks(books);

        await whenUserFetchCatalogPageBy('genre', 'mystery');

        thenTheUserShouldSeeBooks();
    });

    test('should retrieve catalog by author name when user filters with an author name', async () => {
        givenBooks(books);

        await whenUserFetchCatalogPageBy('author', 'John doe');

        thenTheUserShouldSeeBooks();
    });
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })

const givenBooks = (books: BooksModel.Book[] ) => {
    fakeGetBooksAdapter.returnedResponse  = books;
}

const whenUserFetchCatalogPage = async () => {
    await store.dispatch(getBooksUseCase());
}

const whenUserFetchCatalogPageBy = async (type: 'genre' | 'author' | 'name', value: string) => {
    await store.dispatch(getBooksByUsecase({ type, value }));
}


const thenTheUserShouldSeeBooks = (): void => {
    const state = stateBuilder().withSuccess({
        books,
        }).build();
    expect(state).toEqual(store.getState())
};

const books: BooksModel.Book[] = [BookFactory.create()]
