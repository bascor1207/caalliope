import { createAppAsyncThunk } from '@/modules/store/create-app-thunk';
import { parseCookies } from 'nookies';

export const logoutUserUsecase = createAppAsyncThunk(
    'user/logout_user',
    async (_, { extra: { cookiesAdapter } }) => {
        console.log('hello')
        return new Promise<void>((resolve, reject) => {
            cookiesAdapter.destroyCookies( null,'token');
            if (parseCookies().token) reject();
            resolve();
        })
    }
)
