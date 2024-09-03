import { createSlice } from '@reduxjs/toolkit';
import { b } from 'vite-node/index-CCsqCcr7';

import type { UsersModel, } from '@/modules/user/core/model/users.model';
import type { PayloadAction } from '@reduxjs/toolkit';

import { registerUser } from '@/modules/auth/usecases/register.user';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

type InitialState = {
    activeUser: UsersModel.User
    activeProfileTab: 'my-infos' | 'my-books' | 'my-readings' | 'my-wishlist' | 'my-abandoned-books';
    informativeToast: {status: 'displayed' | 'hidden', message: string, type: 'success' | 'error' | 'noTyped'};
    informativeSpinner: boolean;
}

const initialState: InitialState = {
    activeUser: {} as UsersModel.User,
    activeProfileTab: 'my-infos',
    informativeToast: { status: 'hidden', message: '', type: 'noTyped' },
    informativeSpinner: false
}

export const userSlice = createSlice({
    name: 'getUser',
    initialState,
    reducers: {
        myProfileTabState: (state, action: PayloadAction<InitialState['activeProfileTab']>) => {
            state.activeProfileTab = action.payload
        },

        informUser: (state, action: PayloadAction<InitialState['informativeToast']>) => {
            state.informativeToast.status = action.payload.status;
            state.informativeToast.type = action.payload.type;
            state.informativeToast.message = action.payload.message
        },

        showUserHeShouldWait: (state, action: PayloadAction<boolean>) => {
            state.informativeSpinner = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserUsecase.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        });

        builder.addCase(getUserUsecase.rejected, (state) => {
            state.activeUser = {} as UsersModel.User
        });

        builder.addCase(logoutUserUsecase.fulfilled, (state,) => {
            state.activeUser = {} as UsersModel.User
        });

        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        });
    }
});

export const { myProfileTabState, informUser, showUserHeShouldWait } = userSlice.actions;
