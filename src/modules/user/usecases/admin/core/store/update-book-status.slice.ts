import { createSlice } from '@reduxjs/toolkit';

import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';

type InitialState = object & {
    success: boolean;
}

const initialState: InitialState = {
    success: false,
};

export const updateBookStatusSlice = createSlice({
    name: 'updateBookStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateBookStatusUsecase.pending, (state) => {
            state.success = false;
        });
        builder.addCase(updateBookStatusUsecase.fulfilled, (state) => {
            state.success = true;
        });
        builder.addCase(updateBookStatusUsecase.rejected, (state) => {
            state.success = false;
        });
    }
});
