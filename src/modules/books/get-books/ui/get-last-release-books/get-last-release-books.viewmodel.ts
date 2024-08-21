import { RootState } from '@/modules/store/create-store';
import { BooksModel } from '@/modules/books/model/books.model';
import { createSelector } from 'reselect';

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
    books: BooksModel.Book[]
}

type ViewModelResponse = BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

const selectGetBooksState = (state: RootState) => (state.catalog.getBooks);
const booksState = createSelector([selectGetBooksState], booksState => booksState)

export const getBooksLastReleaseViewmodel = () => (state: RootState): ViewModelResponse => {
    const { pendingRequest, rejectedRequest, books } = booksState(state);

    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, books };
}
