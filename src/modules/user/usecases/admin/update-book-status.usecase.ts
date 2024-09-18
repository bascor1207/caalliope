import type {  UsersModel } from '@/modules/user/core/model/users.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const updateBookStatusUsecase = createAppAsyncThunk(
    'admin/updateBookStatus',
    async (data: UsersModel.UpdateBookStatusPayload, { rejectWithValue, extra: { adminAdapter } }) => {
        try {
           return await adminAdapter.updateBookStatus(data);
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return rejectWithValue(error.payload);
            }
            return rejectWithValue({ message: 'Unknown error', type: 'Error' });
        }
    },
);
