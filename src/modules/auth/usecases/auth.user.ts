import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const authUser = createAppAsyncThunk(
    'auth/authenticate',
    async (payload: AuthModel.AuthUserPayload, { extra: { authAdapter } }) => {
        return await authAdapter.authenticate({ ...payload })
    }
);

