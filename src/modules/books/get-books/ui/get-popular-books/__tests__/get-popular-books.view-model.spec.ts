import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/get-popular-books/__tests__/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getPopularBooksViewmodel, gettingBooks } from '../get-popular-books.viewmodel';

describe('test for the viewModel layer of getting popular books', () => {
    it('should handle loading when getting popular books is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getPopularBooksViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.pending, pendingRequest: true });
    });
    it('should handle the error when getting popular books is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getPopularBooksViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.rejected, rejectedRequest: true });
    })
    it('should handle the book list when getting popular books is fulfilled', () => {
        const books = [
            {
                id: 1, title: 'novel title', author: 'Bastien Corré',
                type: 'Novel', subject: 'Fantasy Medieval',
                dateOfPublication: '2023', image: 'test'
            }
        ];
        const initialState = stateBuilder().withSuccess(books).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getPopularBooksViewmodel()(state);
        expect(viewModel).toStrictEqual({ type: gettingBooks.fulfilled, books: books });
    })
})
