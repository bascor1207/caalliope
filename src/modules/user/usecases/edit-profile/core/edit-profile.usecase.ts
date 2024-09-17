import type { UsersModel } from '@/modules/user/core/model/users.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const editProfileUsecase = createAppAsyncThunk(
    'user/editProfile',
    async ({ userId, payload }: { userId: number, payload: UsersModel.EditProfileForm }, { rejectWithValue, extra: { editProfileAdapter } }) => {
       try {
           return await editProfileAdapter.editProfile({ userId, payload });
       } catch (error) {
           if (error instanceof CustomErrorWrapper) {
               return rejectWithValue(error.payload);
           }
           return rejectWithValue({ message: 'Unknown error', type: 'error' });
       }
    },
);
