import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const registerUser = createAppAsyncThunk(
    'auth/register',
    async (payload: AuthModel.AuthFormSchema, { extra: { authAdapter } }) => {
        return await authAdapter.register(payload)
    }
);

