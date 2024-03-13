import { createSlice } from '@reduxjs/toolkit';
import { getBooksUseCase } from '../usecase/get-books/get-books.usecase';
import { getBooksLastReleaseUseCase } from '../usecase/get-books-last-release/get-books-last-release.usecase';
import { Book } from '../connector-to.get-books';
import { getPopularBooksUseCase } from '../usecase/get-popular-books/get-popular-books.usecase';

type InitialState = {
    books: Book[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const getBooksSlice = createSlice( {
    name: 'getBooks',
    initialState: { books: [], pendingRequest: false, rejectedRequest: false } as GetBooksSliceType,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getBooksUseCase.pending, (state) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getBooksUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                state.books = action.payload;
            }
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksLastReleaseUseCase.pending, (state, action) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getBooksLastReleaseUseCase.rejected, (state, action) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksLastReleaseUseCase.fulfilled, (state, action) => {
            state.books = action.payload;
            state.pendingRequest = false;
            state.pendingRequest = false;
        }),
        builder.addCase(getPopularBooksUseCase.pending, (state, action) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getPopularBooksUseCase.rejected, (state, action) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getPopularBooksUseCase.fulfilled, (state, action) => {
            state.books = action.payload;
            state.pendingRequest = false;
            state.pendingRequest = false;
        })
    }
});
