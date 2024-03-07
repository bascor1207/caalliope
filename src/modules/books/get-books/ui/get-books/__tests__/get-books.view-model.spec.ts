import { describe, it, expect } from 'vitest';
<<<<<<< HEAD:src/modules/books/get-books/ui/__tests__/get-books.view-model.spec.ts
import { stateBuilder } from '../../usecase/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksViewModel, gettingBooks } from '@/modules/books/get-books/ui/get-books.viewmodel';
=======
import { stateBuilder } from "../../../usecase/get-books/__tests__/state-builder";
import {createTestStore} from "@/modules/store/create-store";
import {getBooksViewModel, gettingBooks} from "@/modules/books/get-books/ui/get-books/get-books.viewmodel";
>>>>>>> 1bc2286 (debut usecase get books last relase and viewmodel):src/modules/books/get-books/ui/get-books/__tests__/get-books.view-model.spec.ts

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
<<<<<<< HEAD:src/modules/books/get-books/ui/__tests__/get-books.view-model.spec.ts
            books: [{ author: 'Bastien Corré', type: 'Novel', subject: 'Fantasy Medieval', dateOfPublication: '2023' }]
=======
            books: [{title: "novel title", author: "Bastien Corré", type: "Novel", subject: "Fantasy Medieval", dateOfPublication: "2023", image: "test"}]
>>>>>>> 1bc2286 (debut usecase get books last relase and viewmodel):src/modules/books/get-books/ui/get-books/__tests__/get-books.view-model.spec.ts
        };
        const initialState = stateBuilder().withSuccess(payload).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.fulfilled, books: payload.books });
    })
})
