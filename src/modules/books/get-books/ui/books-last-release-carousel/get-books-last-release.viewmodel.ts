import { RootState } from '@/modules/store/create-store';
import { Book } from '../../connector-to.get-books';

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
    books: Book[]
}

type ViewModelResponse = BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

const selectGetBooksState = (state: RootState) => ( state.catalog.getBooks);

export const getBooksLastReleaseViewmodel = () => (state: RootState): ViewModelResponse => {
    const booksState = selectGetBooksState(state)
    const { pendingRequest, rejectedRequest, books } = booksState;
    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, books };
}
