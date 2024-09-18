import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const logoutUserUsecase = createAppAsyncThunk(
    'user/logout_user',
    async (_, { extra: { cookiesAdapter } }) => {
       cookiesAdapter.destroyCookies('token');
       if (window.location.pathname.includes('/my-account')) {
           window.location.href = '/';
       }
       return;
    }
)
