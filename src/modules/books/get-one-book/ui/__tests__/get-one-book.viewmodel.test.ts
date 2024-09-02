import { describe, it, expect } from 'vitest';
import { createTestStore, RootState } from '@/modules/app/core/store/create-store';
import { stateBuilder } from '@/modules/books/get-one-book/usecase/state-builder';
import { getOneBookViewmodel } from '@/modules/books/get-one-book/ui/get-one-book.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '@/modules/books/model/books.factory';


describe('test for one book viewmodel', () => {
    it('should return a pending request', () => {
        const initialState = stateBuilder().withPending('pending').build();
        const state = createTestStore({}, initialState).getState();
        thenItShouldReturn(state, { type: 'pending' })
    });

    it('should return a fulfilled request with a book', () => {
        const initialState = stateBuilder().withSuccess(book).build();
        const state = createTestStore({}, initialState).getState();
        thenItShouldReturn(state, { type: 'fulfilled', selectedBook: book })
    })
});

const book: BooksModel.Book = BookFactory.create()


const thenItShouldReturn = (state: RootState, response: { type: string, selectedBook?: typeof book }) => {
    const viewmodel = getOneBookViewmodel()(state);
    expect(viewmodel).toStrictEqual(response)
};
