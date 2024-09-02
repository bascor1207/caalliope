import { createSlice } from '@reduxjs/toolkit';

import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-editon.usecase';


type InitialState = {
    success: boolean;
    error: boolean;
}
const initialState: InitialState = {
    success: false,
    error: false
}

export const createEditionSlice = createSlice({
    name: 'createEdition',
    initialState,
    reducers:  {},
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
