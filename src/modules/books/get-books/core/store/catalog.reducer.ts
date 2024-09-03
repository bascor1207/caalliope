import { combineReducers } from '@reduxjs/toolkit';

import { getBooksSlice } from './get-books.slice';

export const getBooksReducer = combineReducers({
    [getBooksSlice.name]: getBooksSlice.reducer,
});
