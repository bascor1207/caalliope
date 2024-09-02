import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from '@/modules/auth/core/store/auth.reducer';
import { catalogReducer } from '@/modules/books/get-books/core/catalog.reducer';
import { getBookReducer } from '@/modules/books/get-one-book/core/get-book.reducer';
import { createBookReducer } from '@/modules/books/usecases/create-book/core/store/create-book.reducer';
import { createEditionReducer } from '@/modules/books/usecases/create-edition/core/store/create-edition.reducer';
import { userReducer } from '@/modules/user/core/store/user.reducer';

export const rootReducer = combineReducers({
    catalog: catalogReducer,
    selectedBook: getBookReducer,
    auth: authReducer,
    user: userReducer,
    bookCreation: createBookReducer,
    editionCreation: createEditionReducer
});
