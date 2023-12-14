import { describe, it, expect } from 'vitest';
import {stateBuilder} from "@/modules/catalog/get-books/core/store/state-builder";
import {createTestStore} from "@/modules/store/create-store";
import {getBooksViewModel} from "@/modules/catalog/get-books/react/get-books.viewmodel";

describe('test for the viewModel layer of getting books', () => {
    it('should handle loading when getting books is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({pendingRequest: true});
    });
    it('should handle the error when getting books is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({rejectedRequest: true});
    })
    it('should handle the book list when getting books is fulfilled', () => {
        const payload = {
            connectedUser: true,
            books: [{author: "Bastien Corré", type: "Novel", subject: "Fantasy Medieval", dateOfPublication: "2023"}]
        };
        const initialState = stateBuilder().withSuccess(payload).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({books: payload.books});
    })
})
