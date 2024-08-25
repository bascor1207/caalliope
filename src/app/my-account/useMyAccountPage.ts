import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/modules/store/create-store';
import { selectActiveProfileTab } from '@/modules/user/core/store/user.selectors';
import { CookiesProvider } from '@/modules/app/core/cookies.provider';
import { useRef } from 'react';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';


export const useMyAccountPage = () => {
    function onChange(key: string) {
        systemCookiesProvider.current.setCookie(null, 'activeTab', key);
        dispatch(myProfileTabState(key as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'));
    }

    const dispatch = useDispatch<AppDispatch>()
    const activeProfileTab = useAppSelector(selectActiveProfileTab)
    const items = [
        { id: 'my-infos', label: 'My informations', value: 'my-infos' },
        { id: 'my-books', label: 'My books to read', value: 'my-books' },
        { id: 'my-readings', label: 'My readings', value: 'my-readings' },
        { id: 'my-wishlist', label: 'My wishlist', value: 'my-wishlist' },
        { id: 'my-abandoned-books', label: 'My abandoned books', value: 'my-abandoned-books' }
    ]

    const classNames=
        { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' };

    const systemCookiesProvider = useRef(new CookiesProvider())
    const loggedUser= true;


    return { onChange, dispatch, activeProfileTab, items, classNames, loggedUser }
}
