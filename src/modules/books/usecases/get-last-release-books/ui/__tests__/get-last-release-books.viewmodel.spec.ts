import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-last-release-books/core/__tests__/state-builder';
import { getBooksLastReleaseViewmodel,
    gettingBooks } from '@/modules/books/usecases/get-last-release-books/ui/get-last-release-books.viewmodel';



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
