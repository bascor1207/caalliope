import { decodeJwt } from 'jose';
import { cookies, headers } from 'next/headers';

import { setLanguage } from '@/modules/app/core/store/root.slice';
import { getServerStore } from '@/modules/app/core/store/server-store';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { getBooksLastReleaseUseCase } from '@/modules/books/usecases/get-last-release-books/core/get-last-release-books.usecase';
import { getPopularBooksUseCase } from '@/modules/books/usecases/get-popular-books/core/get-popular-books.usecase';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';




export async function prefetchRootLayout() {
    const cookieBag = cookies();
    const token = cookieBag.get('token')?.value
    const locale = cookieBag.get('i18next')?.value as 'en' | 'fr'
    const store = getServerStore();
    const activeTab = cookieBag.get('activeTab')?.value as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'
    const headersList = headers();
    const bookId = headersList.get('bookId') || '';

    store.dispatch(setLanguage({ lang: locale }));

    if (bookId) {
        await store.dispatch(getOneBookById(parseInt(bookId)))
    }

    if (activeTab) {
        store.dispatch(myProfileTabState(activeTab))
    }

    if (token) {
        const decodedToken = decodeJwt(token);
        await store.dispatch(getUserUsecase({ id: decodedToken.sub as string }));
    }

    await store.dispatch(getPopularBooksUseCase());
    await store.dispatch(getBooksLastReleaseUseCase());

    return JSON.parse(JSON.stringify(store.getState()));
}
