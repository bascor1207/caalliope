import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { authUser } from '@/modules/auth/usecases/auth.user';
import { registerUser } from '@/modules/auth/usecases/register.user';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

type InitialState = object & {
    authModalVisible: boolean;
    loggedUser: boolean;
    error: boolean;
    authType: 'signIn' | 'signUp' | '';
}
const initialState: InitialState = {
    authModalVisible: false,
    loggedUser: false,
    error: false,
    authType: ''
}

export const authSlice = createSlice({
    name: 'getAuth',
    initialState,
    reducers: {
        toggleAuthModal: (state, action: PayloadAction<{visible: boolean; type: InitialState['authType'] }>) => {
            state.authModalVisible = action.payload.visible;
            state.authType = action.payload.type;
        },
        loggUser: (state) => {
            state.loggedUser = true
        },
        switchAuthFormType: (state, action: PayloadAction<{ type: InitialState['authType'] }>) => {
            state.authType = action.payload.type;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authUser.rejected, (state, _) => {
            state.loggedUser = false;
            state.error = true;
        });

        builder.addCase(authUser.pending, (state) => {
            state.loggedUser = false;
            state.error = false;
        })

        builder.addCase(authUser.fulfilled, (state, _) => {
            state.loggedUser = true
        });

        builder.addCase(registerUser.rejected, (state, _) => {
            state.loggedUser = false;
            state.error = true;
        });

        builder.addCase(registerUser.fulfilled, (state, _) => {
            state.loggedUser = true
        });

        builder.addCase(getUserUsecase.fulfilled, (state) => {
            state.loggedUser = true
        });

        builder.addCase(logoutUserUsecase.fulfilled, (state,) => {
            state.loggedUser = false
        })
    }
})

export const { toggleAuthModal, loggUser, switchAuthFormType } = authSlice.actions
