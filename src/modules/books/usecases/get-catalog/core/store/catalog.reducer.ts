import { combineReducers } from '@reduxjs/toolkit';

import { getBooksSlice } from '@/modules/books/usecases/get-catalog/core/store/get-books.slice';


export const getBooksReducer = combineReducers({
    [getBooksSlice.name]: getBooksSlice.reducer,
});
