import { createAction, createReducer } from '@reduxjs/toolkit';

import type { RootState } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { rootReducer } from '@/modules/app/core/store/root-reducer';


// @ts-expect-error I do not understand the error for now
const initialState = rootReducer(undefined, createAction(''));

export const withPendingRequest = createAction<boolean>('WithPendingRequest');
export const withRejectedRequest = createAction<boolean>('WithRejectedRequest');
export const withSuccess = createAction<BooksModel.Book[]>('WithSuccess');

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(withPendingRequest, (state, action) => {
        state.catalog.getBooks.pendingRequest = action.payload;
    }),
    builder.addCase(withRejectedRequest, (state, action) => {
        state.catalog.getBooks.rejectedRequest = action.payload;
    }),
    builder.addCase(withSuccess, (state, action) => {
        state.catalog.getBooks.lastReleaseBooks = action.payload;
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
        setState(updateFn: (_builder: GetBooksLastReleaseStateBuilder) => GetBooksLastReleaseStateBuilder) {
            builder = updateFn(builder);
        },
    };
};

export type GetBooksLastReleaseStateBuilder = ReturnType<typeof stateBuilder>;
export type GetBooksLastReleaseStateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
