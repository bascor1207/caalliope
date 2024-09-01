import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/app/core/store/create-store';
import { getBooksByNameViewmodel } from '../get-books-by-name.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '@/modules/books/model/books.factory';

describe('test to retrieve a books by name inside store', () => {
  it('should return books with name containing the query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const book = getBooksByNameViewmodel('tit')(state);

    expect(book).toStrictEqual([booksList[0]])
  });

  it('should return books with name containing the minimal query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const book = getBooksByNameViewmodel('o')(state);

    expect(book).toStrictEqual(booksList);
  })
})

const booksList: BooksModel.Book[] = [BookFactory.create()];
