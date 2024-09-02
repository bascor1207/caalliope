import { createAction, createReducer } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { rootReducer } from '@/modules/app/core/store/root-reducer';


type PayloadForTest = {
    //connectedUser: boolean;
    books: BooksModel.Book[];
}

// @ts-expect-error I do not understand the error for now
const initialState = rootReducer(undefined, createAction(''));

export const withPendingRequest = createAction<boolean>('WithPendingRequest');
export const withRejectedRequest = createAction<boolean>('WithRejectedRequest');
export const withSuccess = createAction<PayloadForTest>('WithSuccess');

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(withPendingRequest, (state, action) => {
        state.catalog.getBooks.pendingRequest = action.payload;
    }),
    builder.addCase(withRejectedRequest, (state, action) => {
        state.catalog.getBooks.rejectedRequest = action.payload;
    }),
    builder.addCase(withSuccess, (state, action) => {
        //if (action.payload.connectedUser) {
            state.catalog.getBooks.books = action.payload.books;
        //}
    });
});

export const stateBuilder = (state = initialState) => {
    const reduce =
        <P>(actionCreator: ActionCreatorWithPayload<P>) =>
            (payload: P) =>
                stateBuilder(reducer(state, actionCreator(payload)));

    return {
        withPendingRequest: reduce(withPendingRequest),
        withRejectedRequest: reduce(withRejectedRequest),
        withSuccess: reduce(withSuccess),
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
        setState(updateFn: (_builder: GetBooksStateBuilder) => GetBooksStateBuilder) {
            builder = updateFn(builder);
        },
    };
};

export type GetBooksStateBuilder = ReturnType<typeof stateBuilder>;
export type GetBooksStateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
