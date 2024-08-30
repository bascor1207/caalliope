import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const refreshTokenForUser = createAppAsyncThunk(
    'auth/refresh-token',
    async (token: string, { extra: { authAdapter } }) => {
       return await authAdapter.refreshToken({ token })
    }
)
