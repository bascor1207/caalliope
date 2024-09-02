import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';

import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

type InitialState = {
    requestStatus: 'pending' | 'rejected' | 'fulfilled' | '',
    selectedBook: BooksModel.Book
}

const initialState: InitialState = {
    requestStatus: '',
    selectedBook: {} as BooksModel.Book
}
export const getBookSlice = createSlice({
    name: 'getBook',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getOneBookById.pending, (state) => {
            state.requestStatus = 'pending';
        });
        builder.addCase(getOneBookById.fulfilled, (state, action) => {
            state.selectedBook = action.payload as BooksModel.Book;
            state.requestStatus = 'fulfilled';
        })
    }
})
