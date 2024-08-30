import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import {
    UsersModel,
} from '@/modules/user/model/users.model';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';
import { registerUser } from '@/modules/auth/usecases/register.user';

type InitialState = {
    activeUser: UsersModel.User
    activeProfileTab: 'my-infos' | 'my-books' | 'my-readings' | 'my-wishlist' | 'my-abandoned-books'
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
        });

        builder.addCase(logoutUserUsecase.fulfilled, (state,) => {
            state.activeUser = {} as UsersModel.User
        });

        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        })
    }
});

export const { myProfileTabState } = userSlice.actions;
