import { parseCookies } from 'nookies';

import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const logoutUserUsecase = createAppAsyncThunk(
    'user/logout_user',
    async (_, { extra: { cookiesAdapter } }) => {
        return new Promise<void>((resolve, reject) => {
            cookiesAdapter.destroyCookies('token');
            if (parseCookies().token) reject();
            resolve();
        })
    }
)
