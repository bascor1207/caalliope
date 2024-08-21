import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksBySubjectUtils } from '../get-books-by-subject.utils';
import { BookFactory } from '@/modules/books/model/books.factory';

describe('test for the viewModel layer of getting books by name or author name', () => {
    it('should return the books which subject match the query', () => {
        const initialState = stateBuilder().withSuccess({ books: booksList }).build();
        const state = createTestStore({}, initialState).getState();
        const books = getBooksBySubjectUtils(state.catalog.getBooks.books, 'fantasy medieval');
        expect(books).toStrictEqual([booksList[0]]);
    });
})

const booksList = [BookFactory.create()];
