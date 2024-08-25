'use client'
import { selectActiveProfileTab } from '@/modules/user/core/store/user.selectors';
import { AppDispatch, useAppSelector } from '@/modules/store/create-store';
import { Tab, Tabs } from '@nextui-org/react';
import { myProfileTabState } from '@/modules/user/core/store/user.slice';
import { useDispatch } from 'react-redux';
import { setCookie } from 'nookies';
import { MyInfosPage } from '@/modules/user/ui/pages/my-infos.page';

export default function MyAccountPage() {
    const dispatch = useDispatch<AppDispatch>()
    const activeProfileTab = useAppSelector(selectActiveProfileTab)
    const items = [
        { id: 'my-infos', label: 'My informations', value: 'my-infos' },
        { id: 'my-books', label: 'My books', value: 'my-books' },
        { id: 'my-wishlist', label: 'My wishlist', value: 'my-wishlist' },
        { id: 'my-abandoned-books', label: 'My abandoned books', value: 'my-abandoned-books' }
    ]

    const classNames=
        { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' }

    return (
        <>
            <div className='flex items-center justify-center my-4'>
                <Tabs
                    aria-label='Dynamic tabs' items={items} classNames={classNames}
                    selectedKey={activeProfileTab}
                    onSelectionChange={(key) => {
                        setCookie(null, 'activeTab', key.toString(), { path: '/' });
                        dispatch(myProfileTabState(key.toString() as 'my-infos' | 'my-books' | 'my-wishlist' | 'my-abandoned-books'));
                    }}
                >
                    {(item) => (
                        <Tab key={item.value} title={item.label}/>
                    )}
                </Tabs>
            </div>
            {activeProfileTab === 'my-infos' && <MyInfosPage/>}
        </>
    )
}
