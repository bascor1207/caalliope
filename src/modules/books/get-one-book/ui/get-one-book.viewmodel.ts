import { RootState } from '@/modules/store/create-store';
import { Book } from '../connector-to.get-one-book';

export const gettingBook = {
    pending: 'pending',
    rejected: 'gettingBookRejected',
    fulfilled: 'fulfilled'
} as const;

type BooksGettingPending = {
    type: typeof gettingBook.pending,
}

type BooksGettingRejected = {
    type: typeof gettingBook.rejected,
    rejectedRequest: boolean
}

type BooksGettingFulfilled = {
    type: typeof gettingBook.fulfilled,
    selectedBook: Book
}

type Response = | BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

export const getOneBookViewmodel = () => (state: RootState): Response => {
    const selectedBookState = state.selectedBook.getBook;

    const { requestStatus, selectedBook } = selectedBookState;

    if (requestStatus === 'pending') {
        return { type: gettingBook.pending }
    }

    return { type: gettingBook.fulfilled, selectedBook }
}
