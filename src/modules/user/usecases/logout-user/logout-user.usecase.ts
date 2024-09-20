import { createAppAsyncThunk } from '@/modules/app/core/store/create-app-thunk';

export const logoutUserUsecase = createAppAsyncThunk(
    'user/logout_user',
    async (pathname: string, { getState ,extra: { cookiesAdapter } }) => {
        const locale = getState().app.language;
        cookiesAdapter.destroyCookies('token');
        if (pathname.includes('my-account')) {
            window.location.href = `/${locale}`
        }
        return;
    }
)
