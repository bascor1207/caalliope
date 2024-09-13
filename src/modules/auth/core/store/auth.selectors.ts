import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectAuthState = (state: RootState) => state.auth.getAuth;

export const selectAuthModalVisible = createSelector(
    [selectAuthState],
    (authState) => authState.authModalVisible
);

export const selectAuthType = createSelector(
    [selectAuthState],
    (authState) => authState.authType
);

export const selectLoggedUser = createSelector(
    [selectAuthState],
    (authState) => authState.loggedUser
);

export const selectAuthError = createSelector(
    [selectAuthState],
    (authState) => authState.error
);
