import { createSlice } from '@reduxjs/toolkit';

import { updateBookUsecase } from '@/modules/books/usecases/update-book/core/update-book.usecase';

type InitialState = object & {
    success: boolean;
    error: boolean;
}
const initialState: InitialState = {
    success: false,
    error: false
}

export const updateBookSlice = createSlice({
    name: 'updateBook',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateBookUsecase.pending, (state) => {
            state.success = false;
            state.error = false;
        });

        builder.addCase(updateBookUsecase.fulfilled, (state) => {
            state.success = true;
        });

        builder.addCase(updateBookUsecase.rejected, (state) => {
            state.error = true;
        });
    }
})
