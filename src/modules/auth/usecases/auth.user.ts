import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';
import { AuthModel } from '@/modules/auth/model/auth.model';

export const authUser = createAppAsyncThunk(
    'auth/user',
    async (payload: AuthModel.AuthUserPayload, { extra: { authAdapter } }) => {
        return await authAdapter.authenticate({ ...payload })
    }
);

