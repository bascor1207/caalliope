import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const authUser = createAppAsyncThunk(
    'auth/authenticate',
    async (payload: AuthModel.AuthUserPayload, { extra: { authAdapter } }) => {
        try {
            await authAdapter.authenticate({ ...payload })
            return window.location.replace('/my-account');
        } catch (error) {
            return error;
        }
    }
);

