import { ActionCreatorWithPayload, createAction, createReducer } from '@reduxjs/toolkit';
import { rootReducer } from '@/modules/store/root-reducer';
import { RootState } from '@/modules/store/create-store';
import { BooksModel } from '@/modules/books/model/books.model';

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
