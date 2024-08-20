import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/modules/store/create-store';
import { authUser } from '@/modules/auth/usecases/auth.user';

type InitialState = {
    authModalVisible: boolean;
    loggedUser: boolean;
    error: boolean;
}
const initialState: InitialState = {
    authModalVisible: false,
    loggedUser: false,
    error: false
}

export const authSlice = createSlice({
    name: 'getAuth',
    initialState,
    reducers: {
        toggleAuthModal: (state, action: PayloadAction<boolean>) => {
            state.authModalVisible = action.payload
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
    }
})

export const { toggleAuthModal } = authSlice.actions

export const selectAuthModalVisible = () => (state: RootState) => {
    return state.auth.getAuth.authModalVisible
}
