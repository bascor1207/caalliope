import { describe, it, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';

import { stateBuilder } from '../../../usecase/get-popular-books/__tests__/state-builder';
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
        const initialState = stateBuilder().withSuccess(books).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getPopularBooksViewmodel()(state);
        expect(viewModel).toStrictEqual({ type: gettingBooks.fulfilled, mostPopularBooks: books });
    })
})

const books: BooksModel.Book[] = [BookFactory.create()]

