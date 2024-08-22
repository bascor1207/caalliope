import { createSelector } from 'reselect';
import { RootState } from '@/modules/store/create-store';

const selectGetBooksState = (state: RootState) => state.catalog.getBooks;

export const selectBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.books
);

export const selectMostPopularBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.mostPopularBooks
);

export const selectLastReleaseBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.lastReleaseBooks
);

export const selectPendingRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.pendingRequest
);

export const selectRejectedRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.rejectedRequest
);
