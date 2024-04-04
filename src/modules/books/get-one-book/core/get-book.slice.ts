import { createSlice } from '@reduxjs/toolkit';
import { getOneBookByAuthor } from '@/modules/books/get-one-book/usecase/get-one-book-by-author.usecase';

export type Book = {
    id: string;
    author: string;
    title: string;
}

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
        builder.addCase(getOneBookByAuthor.pending, (state) => {
            state.requestStatus = 'pending';
        });
        builder.addCase(getOneBookByAuthor.fulfilled, (state, action) => {
            state.selectedBook = action.payload as Book;
            state.requestStatus = 'fulfilled';
        })
    }
})
