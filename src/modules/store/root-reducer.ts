import { combineReducers } from '@reduxjs/toolkit';
import { catalogReducer } from '../books/get-books/core/catalog.reducer';
import { getBookReducer } from '@/modules/books/get-one-book/core/get-book.reducer';
import { authReducer } from '@/modules/auth/core/store/auth.reducer';

export const rootReducer = combineReducers({
    catalog: catalogReducer,
    selectedBook: getBookReducer,
    auth: authReducer
});

