import { describe, it, expect } from 'vitest';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { stateBuilder } from '@/modules/books/usecases/get-catalog/core/__tests__/state-builder';
import { getBooksViewModel, gettingBooks } from '@/modules/books/usecases/get-catalog/ui/get-books/get-books.viewmodel';


describe('test for the viewModel layer of getting books', () => {
    it('should handle loading when getting books is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.pending, pendingRequest: true });
    });
    it('should handle the error when getting books is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.rejected, rejectedRequest: true });
    })
    it('should handle the book list when getting books is fulfilled', () => {
        const payload = {
            connectedUser: true,
            books: [BookFactory.create()]
        };
        const initialState = stateBuilder().withSuccess(payload).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.fulfilled, books: payload.books });
    })
})
