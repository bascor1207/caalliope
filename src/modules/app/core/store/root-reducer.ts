import { combineReducers } from '@reduxjs/toolkit';
import { getBookReducer } from '@/modules/books/get-one-book/core/get-book.reducer';
import { authReducer } from '@/modules/auth/core/store/auth.reducer';
import { userReducer } from '@/modules/user/core/store/user.reducer';
import { catalogReducer } from '@/modules/books/get-books/core/catalog.reducer';

export const rootReducer = combineReducers({
    catalog: catalogReducer,
    selectedBook: getBookReducer,
    auth: authReducer,
    user: userReducer
});
