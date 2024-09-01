import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { getBooksByAuthorViewmodel } from '../get-books-by-author.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '@/modules/books/model/books.factory';
import { createTestStore } from '@/modules/app/core/store/create-store';

describe('test to retrieve a books by name inside store', () => {
  it('should return books with name containing the query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('corr')(state);

    expect(books).toStrictEqual(booksList)
  });

  it('should return books with name containing the minimal query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('o')(state);

    expect(books).toStrictEqual(booksList);
  })
})

const booksList: BooksModel.Book[] = [BookFactory.create()];
