import { createSlice } from '@reduxjs/toolkit';

import { updateEditionUsecase } from '@/modules/books/usecases/update-edition/core/update-edition.usecase';


type InitialState = {
    success: boolean;
    error: boolean;
}
const initialState: InitialState = {
    success: false,
    error: false
}

export const updateEditionSlice = createSlice({
    name: 'updateEdition',
    initialState,
    reducers: {},
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
