import { combineReducers } from '@reduxjs/toolkit';

import { createEditionSlice } from '@/modules/books/usecases/create-edition/core/store/create-edition.slice';


export const createEditionReducer = combineReducers({
    [createEditionSlice.name]: createEditionSlice.reducer,
});
