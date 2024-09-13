import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectGetBooksState = (state: RootState) => state.homePage.getLastReleaseBooks;

export const selectLastReleaseBooks = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.lastReleaseBooks
);

export const selectLastReleaseBooksPendingRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.pendingRequest
);

export const selectLastReleaseBooksRejectedRequest = createSelector(
    [selectGetBooksState],
    (getBooksState) => getBooksState.rejectedRequest
);
