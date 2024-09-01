import { RootState } from '@/modules/app/core/store/create-store';
import { BooksModel } from '@/modules/books/model/books.model';
import {
    selectLastReleaseBooks,
    selectPendingRequest,
    selectRejectedRequest
} from '@/modules/books/get-books/core/get-books.selectors';

export const gettingBooks = {
    pending: 'gettingBooksLastReleasePending',
    rejected: 'gettingBooksLastReleaseRejected',
    fulfilled: 'gettingBooksLastReleaseFulfilled'
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
    lastReleaseBooks: BooksModel.Book[]
}

type ViewModelResponse = BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

export const getBooksLastReleaseViewmodel = () => (state: RootState) : ViewModelResponse => {
    const lastReleaseBooks = selectLastReleaseBooks(state);
    const pendingRequest = selectPendingRequest(state);
    const rejectedRequest = selectRejectedRequest(state);

    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, lastReleaseBooks };
}
