import { combineReducers } from '@reduxjs/toolkit';
import { authSlice } from '@/modules/auth/core/store/auth.slice';


export const authReducer = combineReducers({
    [authSlice.name]: authSlice.reducer,
});
