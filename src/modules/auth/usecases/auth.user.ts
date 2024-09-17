import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const authUser = createAppAsyncThunk(
    'auth/authenticate',
    async ({ payload }: {payload:AuthModel.AuthUserPayload}, { rejectWithValue, extra: { authAdapter } }) => {
        try {
            return await authAdapter.authenticate({ ...payload })
        } catch (error) {
            if (error instanceof CustomErrorWrapper) {
                return rejectWithValue({ ...error.payload })
            }
            return rejectWithValue({ message: 'Unknown error', type: 'error' })
        }
    }
);

