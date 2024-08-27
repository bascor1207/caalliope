import { createSlice } from '@reduxjs/toolkit';
import { UsersModel } from '../../model/users.model';
import { getUsersUseCase } from '../usecase/get-users.usecase';

type InitialState = {
    users: UsersModel.User[];
};

type GetUsersSliceType = InitialState & {
    pendingRequest: boolean;
    rejectedRequest: boolean;
};

export const initialState: GetUsersSliceType = {
    users: [],
    pendingRequest: false,
    rejectedRequest: false,
};

export const getUsersSlice = createSlice( {
    name: 'getUsers',
    initialState,
    reducers: {},
    extraReducers : (builder)=> {
        builder.addCase(getUsersUseCase.pending, (state) => {
            state.pendingRequest = true;
        })

        builder.addCase(getUsersUseCase.rejected, (state) => {
            state.rejectedRequest = true;
            state.pendingRequest = false;
        })

        builder.addCase(getUsersUseCase.fulfilled, (state, action) => {
            if (action.payload) {
                state.users = action.payload;
            }
            state.pendingRequest = false;
        })
    }
});
