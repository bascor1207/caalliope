import { RootState, useAppSelector } from '@/modules/store/create-store';
import { BooksModel } from '@/modules/books/model/books.model';
import { createSelector } from 'reselect';
import {
    selectLastReleaseBooks, selectMostPopularBooks,
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

export const useGetPopularBooksViewmodel = (): ViewModelResponse => {
    const mostPopularBooks = useAppSelector(selectMostPopularBooks);
    const pendingRequest = useAppSelector(selectPendingRequest);
    const rejectedRequest = useAppSelector(selectRejectedRequest);

    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }

    return { type: gettingBooks.fulfilled, mostPopularBooks };
}
