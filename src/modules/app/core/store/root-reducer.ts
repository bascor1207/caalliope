import { combineReducers } from '@reduxjs/toolkit';

import { rootSlice } from '@/modules/app/core/store/root.slice';
import { authReducer } from '@/modules/auth/core/store/auth.reducer';
import { getBookReducer } from '@/modules/books/get-one-book/core/get-book.reducer';
import { createBookSlice } from '@/modules/books/usecases/create-book/core/store/create-book.slice';
import { createEditionSlice } from '@/modules/books/usecases/create-edition/core/store/create-edition.slice';
import { getBooksReducer } from '@/modules/books/usecases/get-catalog/core/store/catalog.reducer';
import { getLastReleaseBooksSlice } from '@/modules/books/usecases/get-last-release-books/core/store/get-last-release-books.slice';
import { getPopularBooksSlice } from '@/modules/books/usecases/get-popular-books/core/store/get-popular-books.slice';
import { updateBookSlice } from '@/modules/books/usecases/update-book/core/store/update-book.slice';
import { updateEditionSlice } from '@/modules/books/usecases/update-edition/core/store/update-edition.slice';
import { userSlice } from '@/modules/user/core/store/user.slice';
import { updateBookStatusSlice } from '@/modules/user/usecases/admin/core/store/update-book-status.slice';
import { editProfileSlice } from '@/modules/user/usecases/edit-profile/core/store/edit-profile.slice';

const actions = combineReducers({
    [createBookSlice.name]: createBookSlice.reducer,
    [createEditionSlice.name]: createEditionSlice.reducer,
    [updateBookSlice.name]: updateBookSlice.reducer,
    [updateEditionSlice.name]: updateEditionSlice.reducer,
    [editProfileSlice.name]: editProfileSlice.reducer,
})

export const rootReducer = combineReducers({
    app: rootSlice.reducer,
    catalog: getBooksReducer,
    selectedBook: getBookReducer,
    auth: authReducer,
    user: combineReducers({ [userSlice.name]: userSlice.reducer, actions }),
    homePage: combineReducers({ [getPopularBooksSlice.name]: getPopularBooksSlice.reducer,
        [getLastReleaseBooksSlice.name]: getLastReleaseBooksSlice.reducer }),
    updateBook: updateBookStatusSlice.reducer,
});
