import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectUserState = (state: RootState) => state.user.getUser;

export const selectActiveUser = createSelector(
    [selectUserState],
    (userState) => userState.activeUser
);

export const selectActiveProfileTab = createSelector(
    [selectUserState],
    (userState) => userState.activeProfileTab
);

export const selectInformativeToast = createSelector(
    [selectUserState],
    (userState) => userState.informativeToast
)

export const selectInformativeSpinner = createSelector(
    [selectUserState],
    (userState) => userState.informativeSpinner
)

export const selectContactFormState = createSelector(
    [selectUserState],
    (userState) => userState.contactFormState
)

export const selectEditProfileFormState = createSelector(
    [selectUserState],
    (userState) => userState.editProfileFormState
)
