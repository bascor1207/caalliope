import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

type InitialState = {
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authUser.rejected, (state, _) => {
            state.loggedUser = false;
            state.error = true;
        });

        builder.addCase(authUser.fulfilled, (state, _) => {
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

export const { toggleAuthModal, loggUser } = authSlice.actions
