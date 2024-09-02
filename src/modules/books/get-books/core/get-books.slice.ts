import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getBooksUseCase } from '../usecase/get-books.usecase';
import { getBooksLastReleaseUseCase } from '../usecase/get-last-release-books/get-last-release-books.usecase';
import { getPopularBooksUseCase } from '../usecase/get-popular-books/get-popular-books.usecase';

type InitialState = {
    books: BooksModel.Book[];
    mostPopularBooks: BooksModel.Book[];
    lastReleaseBooks: BooksModel.Book[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const initialState: GetBooksSliceType = {
    books: [],
    mostPopularBooks: [],
    lastReleaseBooks: [],
    pendingRequest: false,
    rejectedRequest: false,
};

export const getBooksSlice = createSlice( {
    name: 'getBooks',
    initialState,
    reducers: {},
    extraReducers : (builder)=> {
        builder.addCase(getBooksUseCase.pending, (state) => {
            state.pendingRequest = true;
        })

        builder.addCase(getBooksUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        })

        builder.addCase(getBooksUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                state.books = action.payload;
            }
            state.pendingRequest = false;
        })

        builder.addCase(getBooksLastReleaseUseCase.pending, (state) => {
            state.pendingRequest = true;
        })

        builder.addCase(getBooksLastReleaseUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        })

        builder.addCase(getBooksLastReleaseUseCase.fulfilled, (state, action) => {
            state.pendingRequest = false;
            if (action.payload) {
                state.lastReleaseBooks = action.payload;
            }
        })

        builder.addCase(getPopularBooksUseCase.pending, (state) => {
            state.pendingRequest = true;
        })

        builder.addCase(getPopularBooksUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        })

        builder.addCase(getPopularBooksUseCase.fulfilled, (state, action) => {
            state.pendingRequest = false;
            if (action.payload) {
                state.mostPopularBooks = action.payload;
            }
        })
    }
});
