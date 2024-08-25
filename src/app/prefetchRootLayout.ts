import { cookies } from 'next/headers';
import { ssrApp } from '@/modules/main.ssr';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';
import { jwtVerify } from 'jose';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { getPopularBooksUseCase } from '@/modules/books/get-books/usecase/get-popular-books/get-popular-books.usecase';
import {
    getBooksLastReleaseUseCase
} from '@/modules/books/get-books/usecase/get-last-release-books/get-last-release-books.usecase';

export async function prefetchRootLayout() {
    const cookieBag = cookies();
    const token = cookieBag.get('token')?.value
    const store = ssrApp.store
    const activeTab =  cookieBag.get('activeTab')?.value as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'

    if (activeTab) {
        store.dispatch(myProfileTabState(activeTab))
    }


    if (token) {
        await store.dispatch(getUserUsecase({ id: '2' }))
    //     try {
            // const { payload } = await jwtVerify(token, new TextEncoder().encode('azerty'));
            // await store.dispatch(getUserUsecase({ id: payload.sub as string, token }));
    //     } catch (error) {
    //         console.error('Échec de la vérification du token:', error);
    //     }
    }

    await store.dispatch(getPopularBooksUseCase());
    await store.dispatch(getBooksLastReleaseUseCase());

   return JSON.parse(JSON.stringify(store.getState()));
}
