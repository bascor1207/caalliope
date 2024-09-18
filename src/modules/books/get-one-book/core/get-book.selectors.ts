import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectBookState = (state: RootState) => state.selectedBook.getBook;

export const selectCurrentBook = createSelector(
    [selectBookState],
    (bookState) => bookState.selectedBook
);

export const selectRequestStatus = createSelector(
    [selectBookState],
    (bookState) => bookState.requestStatus
);

export const selectBookDetailsModalState = createSelector(
    [selectBookState],
    (bookState) => bookState.bookDetailsModal
);
