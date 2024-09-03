import type { RootState } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';

import { selectLastReleaseBooks, selectLastReleaseBooksPendingRequest, selectLastReleaseBooksRejectedRequest } from '@/modules/books/usecases/get-last-release-books/core/store/get-last-release-books.selectors';

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
    const pendingRequest = selectLastReleaseBooksPendingRequest(state);
    const rejectedRequest = selectLastReleaseBooksRejectedRequest(state);

    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, lastReleaseBooks };
}
