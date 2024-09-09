import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { UserBookCard } from '@/modules/user/ui/components/user-book.card';

export const MyWishlistSection = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);

    const content = () => {
        return (
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {activeUser.myWishlist.map((book) => (
                    <UserBookCard key={book.id} book={book} />
                ))}
            </div>
        )
    };

    return (
        <CustomCard title={t('account.home')} content={content} className='w-full cursor-default min-h-full' />
    )
}
