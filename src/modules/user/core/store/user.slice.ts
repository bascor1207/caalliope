import { createSlice } from '@reduxjs/toolkit';

import type { UsersModel, } from '@/modules/user/core/model/users.model';
import type { PayloadAction } from '@reduxjs/toolkit';

import { registerUser } from '@/modules/auth/usecases/register.user';
import { editProfileUsecase } from '@/modules/user/usecases/edit-profile/core/edit-profile.usecase';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';

type InitialState = object & {
    activeUser: UsersModel.User
    activeProfileTab: 'admin' | 'my-infos' | 'my-books' | 'my-readings' | 'my-wishlist' | 'my-abandoned-books';
    informativeToast: {status: 'displayed' | 'hidden', message: string, type: 'success' | 'error' | 'noTyped'};
    informativeSpinner: boolean;
    contactFormState: 'displayed' | 'hidden'
    editProfileFormState: 'displayed' | 'hidden'
    editAvatarFormState: 'displayed' | 'hidden'
}

const initialState: InitialState = {
    activeUser: {} as UsersModel.User,
    activeProfileTab: 'my-infos',
    informativeToast: { status: 'hidden', message: '', type: 'noTyped' },
    informativeSpinner: false,
    contactFormState: 'hidden',
    editProfileFormState: 'hidden',
    editAvatarFormState: 'hidden'
}

export const userSlice = createSlice({
    name: 'getUser',
    initialState,
    reducers: {
        myProfileTabState: (state, action: PayloadAction<InitialState['activeProfileTab']>) => {
            state.activeProfileTab = action.payload
        },

        informUser: (state, action: PayloadAction<InitialState['informativeToast']>) => {
            state.informativeToast.status = action.payload.status;
            state.informativeToast.type = action.payload.type;
            state.informativeToast.message = action.payload.message
        },

        showUserHeShouldWait: (state, action: PayloadAction<boolean>) => {
            state.informativeSpinner = action.payload;
        },

        contactUs: (state, action: PayloadAction<'displayed' | 'hidden'>) => {
            state.contactFormState = action.payload;
        },

        editProfile: (state, action: PayloadAction<'displayed' | 'hidden'>) => {
            state.editProfileFormState = action.payload;
        },

        editAvatar: (state, action: PayloadAction<'displayed' | 'hidden'>) => {
            state.editAvatarFormState = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserUsecase.fulfilled, (state, action) => {
            if (action.payload) {
                state.activeUser = action.payload;
            }
        });

        builder.addCase(getUserUsecase.rejected, (state) => {
            state.activeUser = {} as UsersModel.User
        });

        builder.addCase(logoutUserUsecase.fulfilled, (state,) => {
            state.activeUser = {} as UsersModel.User
        });

        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.activeUser = action.payload;
        });

        builder.addCase(editProfileUsecase.fulfilled, (state, action) => {
            if (action.payload) {
                state.activeUser = action.payload;
            }
        });
    }
});

export const {
    myProfileTabState, informUser, showUserHeShouldWait,
    contactUs, editProfile, editAvatar
} = userSlice.actions;
