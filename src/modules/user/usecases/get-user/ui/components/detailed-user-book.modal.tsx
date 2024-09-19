import { Button, Select, SelectItem } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { selectBookDetailsModalState, selectCurrentBook } from '@/modules/books/get-one-book/core/get-book.selectors';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { selectActiveProfileTab, selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';
import { updateUserBookUsecase } from '@/modules/user/usecases/update-user-book/update-user-book.usecase';

export const DetailedUserBookModal = () => {
    const selectedBook = useAppSelector(selectCurrentBook);
    const booksDetailsModalStatus = useAppSelector(selectBookDetailsModalState);
    const activeTab = useAppSelector(selectActiveProfileTab);
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();


    const getFinalBook = () => {
        const selectedBookWithStatus = { ...selectedBook, status: '' };

        const statusMap = {
            'my-readings': activeUser.myInProgressBooks,
            'my-wishlist': activeUser.myWishlist,
            'my-abandoned-books': activeUser.myAbandonedBooks,
            'my-books': activeUser.myBooksToRead,
            'admin': null,
            'my-infos': null
        };

        const booksList = statusMap[activeTab];

        if (!booksList) {
            return selectedBookWithStatus;
        }

        const foundBook = booksList.find((book) => book.id === selectedBook.id);
        if (foundBook) {
            selectedBookWithStatus.status = foundBook.status;
        }

        return selectedBookWithStatus;
    };

    const finalBook = getFinalBook();

    return (
        Object.keys(finalBook).length > 0 && (
            <CustomModal
                modalTitle={finalBook.title}
                isShown={booksDetailsModalStatus === 'displayed'}
                hideModal={() => dispatch(bookDetailsModal({ status: 'hidden' }))}
                modalContent={
                    <div className='p-6 max-w-5xl mx-auto h-full'>
                        <div className='flex flex-col md:flex-row gap-8 h-full'>
                            <div className='flex-1 flex flex-col justify-center'>
                                <p className='text-gray-600 text-lg mb-4'>
                                    {finalBook.author?.fullname ? (
                                        <span className='font-semibold text-gray-800'>
                            by {finalBook.author.fullname}
                        </span>
                                    ) : (
                                        <span className='font-semibold text-gray-800'>
                            by {finalBook.author?.firstname} {finalBook.author?.lastname}
                        </span>
                                    )}
                                </p>

                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold text-lg text-gray-900'>Type: </span>
                                    <span className='text-gray-800'>{finalBook.type}</span>
                                </p>

                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold text-lg text-gray-900'>Published: </span>
                                    <span className='text-gray-800'>{finalBook.dateOfPublication}</span>
                                </p>

                                {finalBook.subjects && (
                                    <div className='mb-4'>
                                        <span className='font-semibold text-lg text-gray-900'>Subjects:</span>
                                        <ul className='list-disc list-inside ml-4 mt-2'>
                                            {finalBook.subjects.map((subject, index) => (
                                                <li key={index} className='text-gray-600 text-sm'>
                                                    <span className='font-medium text-gray-700'>{subject.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {finalBook.summary && (
                                    <p className='text-gray-700 mb-4'>
                                        <span className='font-semibold text-lg text-gray-900'>Summary:</span>
                                        <span className='text-gray-800'>{finalBook.summary}</span>
                                    </p>
                                )}

                                {finalBook.rating && (
                                    <p className='text-gray-700'>
                                        <span className='font-semibold text-lg text-gray-900'>Rating:</span>
                                        <span className='text-yellow-500 font-bold'>{finalBook.rating} / 5</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                }
                modalFooter={
                    <>
                        {activeTab === 'admin' ? (
                            <>
                                <Button onPress={() => dispatch(updateBookStatusUsecase({
                                    status: 'refused',
                                    bookId: finalBook.id,
                                    userRole: 'admin'
                                }))}>Refuser</Button>
                                <Button onPress={() => dispatch(updateBookStatusUsecase({
                                    status: 'accepted',
                                    bookId: finalBook.id,
                                    userRole: 'admin'
                                }))}>Accepter</Button>
                            </>
                        ) : (
                            <Select
                                variant='bordered'
                                defaultSelectedKeys={finalBook.status}
                                labelPlacement='inside'
                                size='sm'
                                radius='sm'
                                onChange={(e) => dispatch(updateUserBookUsecase({
                                    status: e.target.value as 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned',
                                    bookId: finalBook.id,
                                    userId: activeUser.id
                                }))}
                            >
                                <SelectItem key='notOwned' value='notOwned'>{t('notOwned')}</SelectItem>
                                <SelectItem key='reading' value='reading'>{t('inProgress')}</SelectItem>
                                <SelectItem key='toRead' value='toRead'>{t('toRead')}</SelectItem>
                                <SelectItem key='read' value='read'>{t('read')}</SelectItem>
                                <SelectItem key='wishlist' value='wishlist'>{t('whislist')}</SelectItem>
                                <SelectItem key='abandoned' value='abandoned'>{t('giveUp')}</SelectItem>
                            </Select>
                        )}
                    </>
                }
            />
        )
    );
};
