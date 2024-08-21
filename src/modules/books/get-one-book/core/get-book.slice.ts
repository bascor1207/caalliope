import { createSlice } from '@reduxjs/toolkit';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { BooksModel } from '@/modules/books/model/books.model';

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
            console.log(action.payload)
            state.selectedBook = action.payload as BooksModel.Book;
            state.requestStatus = 'fulfilled';
        })
    }
})
