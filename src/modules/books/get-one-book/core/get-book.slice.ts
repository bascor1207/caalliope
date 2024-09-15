import { createSlice } from '@reduxjs/toolkit';

import type { BooksModel } from '@/modules/books/model/books.model';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';

type InitialState = {
    requestStatus: 'pending' | 'rejected' | 'fulfilled' | '',
    selectedBook: BooksModel.Book
    bookDetailsModal: 'displayed' | 'hidden'
}

const initialState: InitialState = {
    requestStatus: '',
    selectedBook: {} as BooksModel.Book,
    bookDetailsModal: 'hidden'
}
export const getBookSlice = createSlice({
    name: 'getBook',
    initialState,
    reducers: {
        bookDetailsModal: (state, action: PayloadAction<{ status: 'displayed'; bookId: number } | { status: 'hidden'; bookId?: never }>) => {
            state.bookDetailsModal = action.payload.status as 'displayed' | 'hidden';
        }
    },
    extraReducers(builder) {
        builder.addCase(getOneBookById.pending, (state) => {
            state.requestStatus = 'pending';
        });

        builder.addCase(getOneBookById.fulfilled, (state, action) => {
            state.selectedBook = action.payload as BooksModel.Book;
            state.requestStatus = 'fulfilled';
        })

        builder.addCase(getOneBookById.rejected, (state) => {
            state.requestStatus = 'rejected';
        })

        builder.addCase(updateBookStatusUsecase.fulfilled, (state) => {
            state.selectedBook = {} as BooksModel.Book;
            state.bookDetailsModal = 'hidden';
        })
        builder.addCase(updateBookStatusUsecase.rejected, (state) => {
            state.selectedBook = {} as BooksModel.Book;
            state.bookDetailsModal = 'hidden';
        })
    }
})

export const { bookDetailsModal } = getBookSlice.actions;
