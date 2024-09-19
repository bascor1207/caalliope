import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { UserBookCard } from '@/modules/user/usecases/get-user/ui/components/user-book.card';


export const AdminSection = () => {
    const { t } = useTranslation();
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();

    const content = () => {
        return (
            <div className='p-6 space-y-6'>
                {activeUser.waitingForValidationBooks?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center w-full h-full'>
                        <div className='text-center text-custom-dark-purple font-semibold'>
                            {t('account.noWaitingBooks')}
                        </div>
                    </div>
                ) : (
                    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                        {activeUser.waitingForValidationBooks?.map((book) => (
                            <div key={book.id}>
                                <UserBookCard
                                    onClick={() => dispatch(bookDetailsModal({ status: 'displayed', bookId: book.id }))}
                                    book={book}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <CustomCard
            title={t('account.adminBooksValidation')}
            content={content}
            className='w-full bg-white shadow-lg rounded-xl p-6 cursor-default min-h-full'
            isPressable={false}
            divider
        />
    )
}
