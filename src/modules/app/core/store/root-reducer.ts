import { combineReducers } from '@reduxjs/toolkit';

import { rootSlice } from '@/modules/app/core/store/root.slice';
import { authReducer } from '@/modules/auth/core/store/auth.reducer';
import { getBookReducer } from '@/modules/books/get-one-book/core/get-book.reducer';
import { createBookReducer } from '@/modules/books/usecases/create-book/core/store/create-book.reducer';
import { createEditionReducer } from '@/modules/books/usecases/create-edition/core/store/create-edition.reducer';
import { getBooksReducer } from '@/modules/books/usecases/get-catalog/core/store/catalog.reducer';
import { getLastReleaseBooksSlice } from '@/modules/books/usecases/get-last-release-books/core/store/get-last-release-books.slice';
import { getPopularBooksSlice } from '@/modules/books/usecases/get-popular-books/core/store/get-popular-books.slice';
import { userReducer } from '@/modules/user/core/store/user.reducer';
import { updateBookStatusSlice } from '@/modules/user/usecases/admin/core/store/update-book-status.slice';

export const rootReducer = combineReducers({
    app: rootSlice.reducer,
    catalog: getBooksReducer,
    selectedBook: getBookReducer,
    auth: authReducer,
    user: userReducer,
    bookCreation: createBookReducer,
    editionCreation: createEditionReducer,
    homePage: combineReducers({ [getPopularBooksSlice.name]: getPopularBooksSlice.reducer,
        [getLastReleaseBooksSlice.name]: getLastReleaseBooksSlice.reducer }),
    updateBook: updateBookStatusSlice.reducer,
});
