import { createSlice } from '@reduxjs/toolkit';
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';


type InitialState = {
    success: boolean;
    error: boolean;
}
const initialState: InitialState = {
    success: false,
    error: false
}

export const createBookSlice = createSlice({
    name: 'createBook',
    initialState,
    reducers:  {},
    extraReducers: (builder) => {
        builder.addCase(createBookUsecase.pending, (state) => {
            state.error = false;
            state.success = false;
        });

        builder.addCase(createBookUsecase.rejected, (state) => {
            state.error = true;
            state.success = false;
        });

        builder.addCase(createBookUsecase.fulfilled, (state) => {
            state.error = false;
            state.success = true;
        });
    }

})
