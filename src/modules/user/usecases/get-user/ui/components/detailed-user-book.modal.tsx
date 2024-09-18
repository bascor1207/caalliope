import {
 Button, Image, Select, SelectItem
} from '@nextui-org/react';
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

    const booksPossibleStatuses = ['read', 'toRead', 'wishlist', 'abandoned', 'refused', 'accepted'];

    return (
        Object.keys(finalBook).length > 0 && (
            <CustomModal
                modalTitle={finalBook.title}
                isShown={booksDetailsModalStatus === 'displayed'}
                hideModal={() => dispatch(bookDetailsModal({ status: 'hidden' }))}
                modalContent={
                    <div className='p-6 max-w-5xl mx-auto h-full'>
                        <div className='grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start h-full'>
                            <div className='h-full'>
                                <Image
                                    src={finalBook.image}
                                    alt='Book cover'
                                    removeWrapper
                                    radius='none'
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='h-full flex flex-col justify-center'>
                                <h2 className='text-2xl font-bold mb-2'>{finalBook.title}</h2>
                                <p className='text-gray-600 text-sm mb-4'>
                                    by {finalBook.author?.firstname} {finalBook.author?.lastname}
                                </p>
                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold'>Type:</span> {finalBook.type}
                                </p>
                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold'>Published:</span> {finalBook.dateOfPublication}
                                </p>
                                <div className='mb-4'>
                                    <span className='font-semibold text-gray-700'>Subjects:</span>
                                    <ul className='list-disc list-inside ml-4 mt-2'>
                                        {finalBook.subjects?.map((subject, index) => (
                                            <li key={index} className='text-gray-600 text-sm'>
                                                {subject.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {finalBook.summary && (
                                    <p className='text-gray-700 mb-4'>
                                        <span className='font-semibold'>Summary:</span> {finalBook.summary}
                                    </p>
                                )}
                                {finalBook.rating && (
                                    <p className='text-gray-700'>
                                        <span className='font-semibold'>Rating:</span> {finalBook.rating} / 5
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                }
                modalFooter={
                    <>
                        {activeTab === 'admin' && (
                            <>
                            <Button onPress={() => dispatch(updateBookStatusUsecase({ status: 'refused', bookId: finalBook.id, userRole: 'admin' }))}>Refuser</Button>
                            <Button onPress={() => dispatch(updateBookStatusUsecase({ status: 'accepted', bookId: finalBook.id, userRole: 'admin' }))}>Accepter</Button>
                            </>
                        )}
                            <Select
                                className='bg-custom-grey'
                                variant='bordered'
                                defaultSelectedKeys={[finalBook.status]}
                                labelPlacement='inside'
                                size='sm'
                                radius='sm'
                                onChange={(e) => dispatch(updateUserBookUsecase({ status: e.target.value as 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned', bookId: finalBook.id, userId: activeUser.id }))}
                            >
                                {booksPossibleStatuses.map((status) => (
                                    <SelectItem key={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                        </Select>
                    </>
                }
            />
        )
    );
};
