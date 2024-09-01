import { combineReducers } from '@reduxjs/toolkit';
import { createBookSlice } from '@/modules/books/usecases/create-book/core/store/create-book.slice';


export const createBookReducer = combineReducers({
    [createBookSlice.name]: createBookSlice.reducer,
});
