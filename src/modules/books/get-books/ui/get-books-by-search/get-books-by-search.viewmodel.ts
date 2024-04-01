import {RootState} from "@/modules/store/create-store";
import { Book } from "../../connector-to.get-books";

const selectGetBooksBySearchState = (state: RootState) => ( state.catalog.getBooks);
export const gettingBooks = {
    pending: 'gettingBooksBySearchPending',
    rejected: 'gettingBooksBySearchRejected',
    fulfilled: 'gettingBooksBySearchFulfilled'
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

export const getBooksBySearchViewModel = () => (state: RootState): ViewModelResponse => {
    const getBooksState = selectGetBooksBySearchState(state);
    const { pendingRequest, rejectedRequest, books } = getBooksState;
    if (pendingRequest) {
        return { type: gettingBooks.pending, pendingRequest };
    }
    if (rejectedRequest) {
        return { type: gettingBooks.rejected, rejectedRequest };
    }
    return { type: gettingBooks.fulfilled, books };
}
