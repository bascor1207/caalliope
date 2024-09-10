import { createSelector } from 'reselect';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectBookState = (state: RootState) => state.selectedBook.getBook;

export const selectCurrentBook = createSelector(
    [selectBookState],
    (bookState) => bookState.selectedBook
);

export const selectBookDetailsModalState = createSelector(
    [selectBookState],
    (bookState) => bookState.bookDetailsModal
);
