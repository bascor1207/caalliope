import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { setLanguage } from '@/modules/app/core/store/root.slice';
import { refreshTokenForUser } from '@/modules/auth/usecases/refresh-token.user';
import { getBooksLastReleaseUseCase } from '@/modules/books/usecases/get-last-release-books/core/get-last-release-books.usecase';
import { getPopularBooksUseCase } from '@/modules/books/usecases/get-popular-books/core/get-popular-books.usecase';
import { ssrApp } from '@/modules/main.ssr';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';



export async function prefetchRootLayout() {
    const cookieBag = cookies();
    const token = cookieBag.get('token')?.value
    const locale = cookieBag.get('i18next')?.value as 'en' | 'fr'
    const store = ssrApp.store
    const activeTab =  cookieBag.get('activeTab')?.value as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'

    if (activeTab) {
        store.dispatch(myProfileTabState(activeTab))
    }

    if (token) {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode('azerty'));
            await store.dispatch(getUserUsecase({ id: payload.sub as string }));
        } catch (error) {
            try {
                const response = await store.dispatch(refreshTokenForUser(token))
                const { id } = response.payload as AuthModel.RefreshedToken;
                await store.dispatch(getUserUsecase({ id }));
            } catch (refreshError) {
                console.error('Erreur lors de la tentative de refresh token:', refreshError);
            }
        }
    }
    await store.dispatch(getPopularBooksUseCase());
    await store.dispatch(getBooksLastReleaseUseCase());
    store.dispatch(setLanguage(locale));

   return JSON.parse(JSON.stringify(store.getState()));
}
