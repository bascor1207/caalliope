import { createSlice } from '@reduxjs/toolkit';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { UsersModel } from '@/modules/user/model/users.model';

type InitialState = {
    activeUser: UsersModel.User
}

const initialState: InitialState = {
    activeUser: {} as UsersModel.User
}

export const userSlice = createSlice({
    name: 'getUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserUsecase.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        });

        builder.addCase(getUserUsecase.rejected, (state) => {
            state.activeUser = {} as UsersModel.User
        })
    }
})
