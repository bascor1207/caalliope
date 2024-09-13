import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectAppState = (state: RootState) => state.app;

export const selectLocale = createSelector(
    selectAppState,
    (appState) => appState.language
);
