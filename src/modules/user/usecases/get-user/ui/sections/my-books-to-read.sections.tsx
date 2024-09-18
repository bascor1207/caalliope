import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { UserBookCard } from '@/modules/user/usecases/get-user/ui/components/user-book.card';


export const MyBooksToReadSections = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();

    const content = () => {
        return (
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {activeUser.myBooksToRead.length === 0 && (
                    <div className='flex flex-col items-center justify-center w-full h-full'>
                        <div className='text-center'>
                            {t('account.noBookToRead')}
                        </div>
                    </div>
                )}
                {activeUser.myBooksToRead.map((book) => (
                    <div key={book.id}>
                        <UserBookCard onClick={() => dispatch(bookDetailsModal({ status: 'displayed', bookId: book.id }))} key={book.id} book={book}/>
                    </div>
                ))}
            </div>
        )
    };

    return (
        <CustomCard title={t('account.home')} content={content} className='w-full cursor-default min-h-full' />
    )
}
