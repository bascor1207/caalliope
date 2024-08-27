import { ActionCreatorWithPayload, createAction, createReducer } from '@reduxjs/toolkit';
import { rootReducer } from '@/modules/store/root-reducer';
import { RootState } from '@/modules/store/create-store';
import { UsersModel } from '../../model/users.model';

type PayloadForTest = {
    //connectedUser: boolean;
    users: UsersModel.User[];
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
        state.users.getUsers.users = action.payload.users;
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
        setState(updateFn: (_builder: GetUsersStateBuilder) => GetUsersStateBuilder) {
            builder = updateFn(builder);
        },
    };
};

export type GetUsersStateBuilder = ReturnType<typeof stateBuilder>;
export type GetUsersStateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
