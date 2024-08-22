import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from '@/modules/user/core/store/user.slice';


export const userReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
});
