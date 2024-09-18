import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-edition.usecase';


type InitialState = object & {
    success: boolean;
    error: boolean;
    formStatus: 'displayed' | 'hidden';
}
const initialState: InitialState = {
    success: false,
    error: false,
    formStatus: 'hidden'
}

export const createEditionSlice = createSlice({
    name: 'createEdition',
    initialState,
    reducers:  {
        createEditionForm: (state, action: PayloadAction<'displayed' | 'hidden'>) => {
            state.formStatus = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createEditionUsecase.pending, (state) => {
            state.error = false;
            state.success = false;
        });

        builder.addCase(createEditionUsecase.rejected, (state) => {
            state.error = true;
            state.success = false;
        });

        builder.addCase(createEditionUsecase.fulfilled, (state) => {
            state.error = false;
            state.success = true;
        });
    }
})

export const { createEditionForm }  = createEditionSlice.actions;
