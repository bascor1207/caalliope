import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';


import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectActiveProfileTab, selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';


export const useMyAccountPage = () => {
    const user = useAppSelector(selectActiveUser);
    function onChange(key: string) {
        systemCookiesProvider.current.setCookie('activeTab', key);
        dispatch(myProfileTabState(key as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'));
    }
    const { t } = useTranslation()

    const dispatch = useDispatch<AppDispatch>()
    const activeProfileTab = useAppSelector(selectActiveProfileTab)
    const items = [
        user.roles?.includes('admin') && { id: 'admin', label: t('account.adminPanel'), value: 'admin' },
        { id: 'my-infos', label: t('account.myInfos'), value: 'my-infos' },
        { id: 'my-books', label: t('account.myBooksToRead'), value: 'my-books' },
        { id: 'my-readings', label: t('account.myReadings'), value: 'my-readings' },
        { id: 'my-wishlist', label: t('account.myWishlist'), value: 'my-wishlist' },
        { id: 'my-abandoned-books', label: t('account.myAbandonedBooks'), value: 'my-abandoned-books' }
    ].filter(Boolean) as { id: string; label: string; value: string }[];

    const classNames=
        { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' };


    const systemCookiesProvider = useRef(new HttpCookiesProvider())

    return { onChange, dispatch, activeProfileTab, items, classNames, isUserAdmin: user.roles?.includes('admin') }
}
