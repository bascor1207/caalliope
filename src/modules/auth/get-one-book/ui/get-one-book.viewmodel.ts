import type { RootState } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectCurrentBook, selectRequestStatus } from '@/modules/books/get-one-book/core/get-book.selectors';

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
    selectedBook: BooksModel.Book
}

type Response = | BooksGettingPending | BooksGettingRejected | BooksGettingFulfilled;

export const getOneBookViewmodel = () => (state?: RootState): Response => {
    if (state) {
        const selectedBookFromState = state.selectedBook.getBook.selectedBook;
        const requestStatusFromState = state.selectedBook.getBook.requestStatus;
        if (requestStatusFromState === 'pending') {
            return { type: gettingBook.pending }
        }

        return { type: gettingBook.fulfilled, selectedBook: selectedBookFromState }
    }

    const selectedBook = useAppSelector(selectCurrentBook);
    const requestStatus = useAppSelector(selectRequestStatus);

    if (requestStatus === 'pending') {
        return { type: gettingBook.pending }
    }

    return { type: gettingBook.fulfilled, selectedBook }
}
