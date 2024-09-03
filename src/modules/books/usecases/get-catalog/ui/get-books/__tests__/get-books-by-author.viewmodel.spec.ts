import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-catalog/core/__tests__/state-builder';

import { getBooksByAuthorViewmodel } from '../get-books-by-author.viewmodel';

describe('test to retrieve a books by author inside store', () => {
  it('should return books with author containing the query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('Do')(state);

    expect(books).toStrictEqual(booksList)
  });

  it('should return books with author containing the minimal query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('o')(state);

    expect(books).toStrictEqual(booksList);
  })
})

const booksList: BooksModel.Book[] = [BookFactory.create()];
