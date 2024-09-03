import { createSelector } from 'reselect';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectGetBooksState = (state: RootState) => state.catalog.getBooks;

export const selectBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.books
);

export const selectPendingRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.pendingRequest
);

export const selectRejectedRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.rejectedRequest
);
