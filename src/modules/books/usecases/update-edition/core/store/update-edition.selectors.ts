import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';

const selectUpdateEditionState = (state: RootState) => state.user.actions.updateEdition;

export const selectUpdateEditionForm = createSelector(
    [selectUpdateEditionState],
    (updateEditionState) => updateEditionState.formStatus
);
