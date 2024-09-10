import { useRef } from 'react';
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

    const dispatch = useDispatch<AppDispatch>()
    const activeProfileTab = useAppSelector(selectActiveProfileTab)
    const items = [
        user.roles?.includes('admin') && { id: 'admin', label: 'Admin panel', value: 'admin' },
        { id: 'my-infos', label: 'My informations', value: 'my-infos' },
        { id: 'my-books', label: 'My books to read', value: 'my-books' },
        { id: 'my-readings', label: 'My readings', value: 'my-readings' },
        { id: 'my-wishlist', label: 'My wishlist', value: 'my-wishlist' },
        { id: 'my-abandoned-books', label: 'My abandoned books', value: 'my-abandoned-books' }
    ].filter(Boolean) as { id: string; label: string; value: string }[];

    const classNames=
        { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' };

    const systemCookiesProvider = useRef(new HttpCookiesProvider())

    return { onChange, dispatch, activeProfileTab, items, classNames, isUserAdmin: user.roles?.includes('admin') }
}
