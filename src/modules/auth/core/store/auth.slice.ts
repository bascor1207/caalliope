import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/modules/store/create-store';

type InitialState = {
    authModalVisible: boolean;
}
const initialState: InitialState = {
    authModalVisible: false
}

export const authSlice = createSlice({
    name: 'getAuth',
    initialState,
    reducers: {
        toggleAuthModal: (state, action: PayloadAction<boolean>) => {
            state.authModalVisible = action.payload
        }
    }
})

export const { toggleAuthModal } = authSlice.actions

export const selectAuthModalVisible = () => (state: RootState) => {
    return state.auth.getAuth.authModalVisible
}
