import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { useAppSelector } from '@/modules/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { useTranslation } from 'react-i18next';
import { UserBookCard } from '@/modules/user/ui/components/user-book.card';

export const MyAbandonedBooksPage = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);

    const content = () => {
        return (
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {activeUser.myAbandonedBooks.map((book) => (
                    <UserBookCard book={book}/>
                ))}
            </div>
        )
    };

    return (
        <CustomCard title={t('account.home')} content={content} className='w-full cursor-default min-h-full' />
    )
}
