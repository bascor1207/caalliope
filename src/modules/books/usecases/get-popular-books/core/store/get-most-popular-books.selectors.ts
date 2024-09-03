import { createSelector } from 'reselect';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectGetBooksState = (state: RootState) => state.homePage.getPopularBooks;

export const selectMostPopularBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.mostPopularBooks
);

export const selectMostPopularBooksPendingRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.pendingRequest
);

export const selectMostPopularBooksRejectedRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.rejectedRequest
);
