import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { updateEditionUsecase } from '@/modules/books/usecases/update-edition/core/update-edition.usecase';


type InitialState = {
    success: boolean;
    error: boolean;
    formStatus: 'hidden' | 'displayed';
}
const initialState: InitialState = {
    success: false,
    error: false,
    formStatus: 'hidden'
}

export const updateEditionSlice = createSlice({
    name: 'updateEdition',
    initialState,
    reducers: {
        updateEdition: (state, action: PayloadAction<'displayed' | 'hidden'>) => {
            state.formStatus = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateEditionUsecase.pending, (state) => {
            state.success = false;
            state.error = false;
        });

        builder.addCase(updateEditionUsecase.fulfilled, (state) => {
            state.success = true;
        });

        builder.addCase(updateEditionUsecase.rejected, (state) => {
            state.error = true;
        });
    }
})

export const { updateEdition } = updateEditionSlice.actions;
