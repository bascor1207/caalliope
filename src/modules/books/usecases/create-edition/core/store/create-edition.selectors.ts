import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectCreateEditionState = (state: RootState) => state.user.actions.createEdition;

export const selectCreateEditionForm = createSelector(
    [selectCreateEditionState],
    (createEditionState) => createEditionState.formStatus
);
