'use client'
import { Tab, Tabs } from '@nextui-org/react';

import { useMyAccountPage } from '@/modules/user/usecases/get-user/ui/pages/useMyAccountPage';
import { AdminSection } from '@/modules/user/usecases/get-user/ui/sections/admin.section';
import { MyAbandonedBooksSection } from '@/modules/user/usecases/get-user/ui/sections/my-abandoned-books.section';
import { MyBooksToReadSections } from '@/modules/user/usecases/get-user/ui/sections/my-books-to-read.sections';
import { MyInfosSection } from '@/modules/user/usecases/get-user/ui/sections/my-infos.section';
import { MyReadingsSection } from '@/modules/user/usecases/get-user/ui/sections/my-readings.section';
import { MyWishlistSection } from '@/modules/user/usecases/get-user/ui/sections/my-wishlist.section';

export default function MyAccountPage() {
    const presenter = useMyAccountPage()

    return (
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
            {presenter.isUserAdmin && presenter.activeProfileTab === 'admin' && <AdminSection/>}
            {presenter.activeProfileTab === 'my-infos' && <MyInfosSection/>}
            {presenter.activeProfileTab === 'my-books' && <MyBooksToReadSections />}
            {presenter.activeProfileTab === 'my-readings' && <MyReadingsSection />}
            {presenter.activeProfileTab === 'my-abandoned-books' && <MyAbandonedBooksSection />}
            {presenter.activeProfileTab === 'my-wishlist' && <MyWishlistSection />}
        </>
    )
}
