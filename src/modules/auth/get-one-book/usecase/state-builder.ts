import { createAction, createReducer } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { rootReducer } from '@/modules/app/core/store/root-reducer';


const getOneBook = {
    pending: createAction<'pending'>('PendingRequest'),
    fulfilled: createAction<BooksModel.Book>('FulfilledRequest')
}

const initialState = rootReducer(undefined, createAction('')());

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(getOneBook.pending, (state, action) => {
        state.selectedBook.getBook.requestStatus = action.payload;
    });
    builder.addCase(getOneBook.fulfilled, (state, action) => {
       state.selectedBook.getBook.selectedBook = action.payload;
       state.selectedBook.getBook.requestStatus = 'fulfilled';
    })
});

export const stateBuilder = (state = initialState) => {
    const reduce =
        <P>(actionCreator: ActionCreatorWithPayload<P>) =>
            (payload: P) =>
                stateBuilder(reducer(state, actionCreator(payload)));

    return {
        withSuccess: reduce(getOneBook.fulfilled),
        withPending: reduce(getOneBook.pending),
        build(): RootState {
            return state;
        },
    };
};

export const stateBuilderProvider = () => {
    let builder = stateBuilder();
    return {
        getState() {
            return builder.build();
        },
        setState(updateFn: (_builder: GetOneBookStateBuilder) => GetOneBookStateBuilder) {
            builder = updateFn(builder);
        },
    };
};

export type GetOneBookStateBuilder = ReturnType<typeof stateBuilder>;
export type GetOneBookStateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
