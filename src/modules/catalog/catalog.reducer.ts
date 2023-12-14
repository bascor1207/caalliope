import { combineReducers } from '@reduxjs/toolkit';
import { getBooksSlice } from './get-books/core/store/get-books.slice';

export const catalogReducer = combineReducers({
    [getBooksSlice.name]: getBooksSlice.reducer,
});
