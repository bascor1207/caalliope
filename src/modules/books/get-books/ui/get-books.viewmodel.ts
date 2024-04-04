import { RootState } from '@/modules/store/create-store';
import { Book } from '@/modules/books/get-books/connector-to.get-books';

const selectGetBooksState = (state: RootState) => ( state.catalog.getBooks);
export const gettingBooks = {
    pending: 'gettingBooksPending',
    rejected: 'gettingBooksRejected',
    fulfilled: 'gettingBooksFulfilled'
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
    books: Book[]
}

type ViewModelResponse = BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

export const getBooksViewModel = () => (state: RootState): ViewModelResponse => {
    const getBooksState = selectGetBooksState(state);
    const { pendingRequest, rejectedRequest, books } = getBooksState;
    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, books };
}
