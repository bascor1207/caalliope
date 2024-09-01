import { createSelector } from 'reselect';
import { RootState } from '@/modules/app/core/store/create-store';

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
