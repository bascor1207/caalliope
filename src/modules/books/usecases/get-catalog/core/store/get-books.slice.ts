import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getBooksByUsecase } from '@/modules/books/usecases/get-catalog/core/get-books-by.usecase';
import { getBooksUseCase } from '@/modules/books/usecases/get-catalog/core/get-books.usecase';



type InitialState = object & {
    books: BooksModel.BookForCatalog[];
};

type GetBooksSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
    activeSubjectTab: string;
};

export const initialState: GetBooksSliceType = {
    books: [],
    activeSubjectTab: '',
    pendingRequest: false,
    rejectedRequest: false,
};

export const getBooksSlice = createSlice( {
    name: 'getBooks',
    initialState,
    reducers: {
        setActiveSubjectTab: (state, action) => {
            state.activeSubjectTab = action.payload;
        }
    },
    extraReducers : (builder)=> {
        builder.addCase(getBooksUseCase.pending, (state) => {
            state.pendingRequest = true;
            state.rejectedRequest = false;
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
        builder.addCase(getBooksByUsecase.pending, (state) => {
            state.pendingRequest = true;
            state.rejectedRequest = false;
        })

        builder.addCase(getBooksByUsecase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        })

        builder.addCase(getBooksByUsecase.fulfilled, (state, action) => {
            if (action.payload) {
                state.books = action.payload;
            }
            state.pendingRequest = false;
        })
    }
});

export const { setActiveSubjectTab } = getBooksSlice.actions;
