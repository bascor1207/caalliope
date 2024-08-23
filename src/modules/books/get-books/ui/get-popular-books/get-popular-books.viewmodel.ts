import { RootState, useAppSelector } from '@/modules/store/create-store';
import { BooksModel } from '@/modules/books/model/books.model';
import {
    selectMostPopularBooks,
    selectPendingRequest,
    selectRejectedRequest
} from '@/modules/books/get-books/core/get-books.selectors';

export const gettingBooks = {
    pending: 'gettingPopularBooksPending',
    rejected: 'gettingPopularBooksRejected',
    fulfilled: 'gettingPopularBooksFulfilled'
} as const;

type BooksGettingPending = {
    type: typeof gettingBooks.pending,
    pendingRequest: boolean
}

type BooksGettingRejected = {
    type: typeof gettingBooks.rejected,
    rejectedRequest: boolean
}

type BooksGettingFulfilled = {
    type: typeof gettingBooks.fulfilled,
    mostPopularBooks: BooksModel.Book[]
}

type ViewModelResponse = BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

export const getPopularBooksViewmodel = () => (state: RootState): ViewModelResponse => {
    const mostPopularBooks = selectMostPopularBooks(state);
    const pendingRequest = selectPendingRequest(state);
    const rejectedRequest = selectRejectedRequest(state);

    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }

    return { type: gettingBooks.fulfilled, mostPopularBooks };
}
