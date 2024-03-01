import { combineReducers } from '@reduxjs/toolkit';
import {getBookSlice} from "@/modules/books/get-one-book/core/get-book.slice";

export const getBookReducer = combineReducers({
    [getBookSlice.name]: getBookSlice.reducer,
});
