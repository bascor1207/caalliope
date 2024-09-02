'use client'
import { Tab, Tabs } from '@nextui-org/react';

import { useMyAccountPage } from '@/app/my-account/useMyAccountPage';
import { ConnectionPage } from '@/modules/auth/ui/pages/connection.page';
import { MyAbandonedBooksPage } from '@/modules/user/ui/pages/my-abandoned-books.page';
import { MyBooksToReadPage } from '@/modules/user/ui/pages/my-books-to-read.page';
import { MyInfosPage } from '@/modules/user/ui/pages/my-infos.page';
import { MyReadingsPage } from '@/modules/user/ui/pages/my-readings.page';
import { MyWishlistPage } from '@/modules/user/ui/pages/my-wishlist.page';

export default function MyAccountPage() {
    const presenter = useMyAccountPage()

    return (
        presenter.loggedUser ? (

        <>
            <div className='flex items-center justify-center my-4'>
                <Tabs
                    aria-label='Dynamic tabs' items={presenter.items} classNames={presenter.classNames}
                    selectedKey={presenter.activeProfileTab}
                    onSelectionChange={(key) => { presenter.onChange(key.toString()) }}
                >
                    {(item) => (
                        <Tab key={item.value} title={item.label}/>
                    )}
                </Tabs>
            </div>
            {presenter.activeProfileTab === 'my-infos' && <MyInfosPage/>}
            {presenter.activeProfileTab === 'my-books' && <MyBooksToReadPage />}
            {presenter.activeProfileTab === 'my-readings' && <MyReadingsPage />}
            {presenter.activeProfileTab === 'my-abandoned-books' && <MyAbandonedBooksPage />}
            {presenter.activeProfileTab === 'my-wishlist' && <MyWishlistPage />}
        </>
        ) : (
            <ConnectionPage />
        )
    )
}
