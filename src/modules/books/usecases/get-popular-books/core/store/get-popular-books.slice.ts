import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getPopularBooksUseCase } from '@/modules/books/usecases/get-popular-books/core/get-popular-books.usecase';


type InitialState = object & {
    mostPopularBooks: BooksModel.Book[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const initialState: GetBooksSliceType = {
    mostPopularBooks: [],
    pendingRequest: false,
    rejectedRequest: false,
};

export const getPopularBooksSlice = createSlice( {
    name: 'getPopularBooks',
    initialState,
    reducers: {},
    extraReducers : (builder)=> {
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
