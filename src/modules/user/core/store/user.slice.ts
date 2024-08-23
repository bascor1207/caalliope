import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { UsersModel } from '@/modules/user/model/users.model';

type InitialState = {
    activeUser: UsersModel.User
    activeProfileTab: 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'
}

const initialState: InitialState = {
    activeUser: {} as UsersModel.User,
    activeProfileTab: 'my-infos'
}

export const userSlice = createSlice({
    name: 'getUser',
    initialState,
    reducers: {
        myProfileTabState: (state, action: PayloadAction<InitialState['activeProfileTab']>) => {
            state.activeProfileTab = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserUsecase.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        });

        builder.addCase(getUserUsecase.rejected, (state) => {
            state.activeUser = {} as UsersModel.User
        })
    }
});

export const { myProfileTabState } = userSlice.actions;
