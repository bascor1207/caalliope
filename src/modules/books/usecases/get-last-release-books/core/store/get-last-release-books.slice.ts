import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getBooksLastReleaseUseCase } from '@/modules/books/usecases/get-last-release-books/core/get-last-release-books.usecase';


type InitialState = object & {
    lastReleaseBooks: BooksModel.Book[];
};

type GetLastReleaseBooks = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const initialState: GetLastReleaseBooks = {
    lastReleaseBooks: [],
    pendingRequest: false,
    rejectedRequest: false,
};

export const getLastReleaseBooksSlice = createSlice( {
    name: 'getLastReleaseBooks',
    initialState,
    reducers: {},
    extraReducers : (builder)=> {
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
    }
});
