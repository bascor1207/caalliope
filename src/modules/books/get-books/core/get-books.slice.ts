import { createSlice } from '@reduxjs/toolkit';
import { getBooksUseCase } from '../usecase/get-books.usecase';
import { Book } from '../connector-to.get-books';
import { getBooksLastReleaseUseCase } from '../usecase/get-last-release-books/get-last-release-books.usecase';
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
                console.log('action.payload', action.payload);
                state.books = action.payload;
            }
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksLastReleaseUseCase.pending, (state) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getBooksLastReleaseUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getBooksLastReleaseUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                console.log('action.payload', action.payload);
                state.books = action.payload;
            }
            state.pendingRequest = false;
        }),
        builder.addCase(getPopularBooksUseCase.pending, (state) => {
            state.pendingRequest = true;
        }),
        builder.addCase(getPopularBooksUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        }),
        builder.addCase(getPopularBooksUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                console.log('action.payload', action.payload);
                state.books = action.payload;
            }
            state.pendingRequest = false;
        })
    }
});
