import { describe, it, expect } from 'vitest';
import { stateBuilder } from "../../../usecase/get-books-last-release/__tests__/state-builder";
import { createTestStore } from "@/modules/store/create-store";
import { getBooksLastReleaseViewmodel, gettingBooks } from "@/modules/books/get-books/ui/books-last-release-carousel/get-books-last-release.viewmodel";

describe('test for the viewModel layer of getting books last release', () => {
    it('should handle loading when getting books last release is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toEqual({type: gettingBooks.pending, pendingRequest: true});
    });
    it('should handle the error when getting books last release is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.rejected, rejectedRequest: true });
    })
    it('should handle the book list when getting books last release is fulfilled', () => {
        const payload = {
            books: [
                {
                    id: 1, title: "novel title", author: "Bastien Corré",
                    type: "Novel", subject: "Fantasy Medieval",
                    dateOfPublication: "2023", image: "test"
                }
            ]
        };
        const initialState = stateBuilder().withSuccess(payload.books).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksLastReleaseViewmodel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.fulfilled, books: payload.books });
    })
})
