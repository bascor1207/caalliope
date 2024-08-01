import { createSlice } from '@reduxjs/toolkit';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { Book } from '../connector-to.get-one-book';

type InitialState = {
    requestStatus: 'pending' | 'rejected' | 'fulfilled' | '',
    selectedBook: Book
}

const initialState: InitialState = {
    requestStatus: '',
    selectedBook: {} as Book
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
            state.selectedBook = action.payload as Book;
            state.requestStatus = 'fulfilled';
        })
    }
})
