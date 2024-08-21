import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';
import { AuthModel } from '@/modules/auth/model/auth.model';

export const registerUser = createAppAsyncThunk(
    'auth/register',
    async (payload: AuthModel.AuthFormSchema, { extra: { authAdapter } }) => {
        return await authAdapter.register( payload)
    }
);

