import { combineReducers } from '@reduxjs/toolkit';
import { getUsersSlice } from './get-users.slice';


export const usersReducer = combineReducers({
    [getUsersSlice.name]: getUsersSlice.reducer,
});
