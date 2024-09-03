import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getBooksUseCase } from '../usecase/get-books.usecase';

type InitialState = {
    books: BooksModel.Book[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const initialState: GetBooksSliceType = {
    books: [],
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
    }
});
