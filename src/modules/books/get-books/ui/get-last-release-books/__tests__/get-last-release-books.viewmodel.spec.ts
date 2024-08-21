import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/get-last-release-books/__tests__/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksLastReleaseViewmodel, gettingBooks } from '../get-last-release-books.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '@/modules/books/model/books.factory';

describe('test for the viewModel layer of getting books last release', () => {
    it('should handle loading when getting books last release is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.pending, pendingRequest: true });
    });
    it('should handle the error when getting books last release is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.rejected, rejectedRequest: true });
    })
    it('should handle the book list when getting books last release is fulfilled', () => {
        const initialState = stateBuilder().withSuccess(books).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toStrictEqual({ type: gettingBooks.fulfilled, lastReleaseBooks: books });
    })
})

const books: BooksModel.Book[] = [BookFactory.create()]
