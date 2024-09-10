import { Button, Image } from '@nextui-org/react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { selectBookDetailsModalState, selectCurrentBook } from '@/modules/books/get-one-book/core/get-book.selectors';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';

export const DetailedUserBookModal = () => {
    const selectedBook = useAppSelector(selectCurrentBook);
    const booksDetailsModalStatus = useAppSelector(selectBookDetailsModalState);
    const dispatch = useDispatch<AppDispatch>();

    return (
        Object.keys(selectedBook).length > 0 && (
            <CustomModal
                modalTitle={selectedBook.title}
                isShown={booksDetailsModalStatus === 'displayed'}
                hideModal={() => dispatch(bookDetailsModal({ status: 'hidden' }))}
                modalContent={
                    <div className='p-6 max-w-5xl mx-auto h-full'>
                        <div className='grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start h-full'>
                            <div className='h-full'>
                                <Image
                                    src={selectedBook.image}
                                    alt='Book cover'
                                    removeWrapper
                                    radius='none'
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='h-full flex flex-col justify-center'>
                                <h2 className='text-2xl font-bold mb-2'>{selectedBook.title}</h2>
                                <p className='text-gray-600 text-sm mb-4'>
                                    by {selectedBook.author.firstname} {selectedBook.author.lastname}
                                </p>
                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold'>Type:</span> {selectedBook.type}
                                </p>
                                <p className='text-gray-700 mb-4'>
                                    <span className='font-semibold'>Published:</span> {selectedBook.dateOfPublication}
                                </p>
                                <div className='mb-4'>
                                    <span className='font-semibold text-gray-700'>Subjects:</span>
                                    <ul className='list-disc list-inside ml-4 mt-2'>
                                        {selectedBook.subjects.map((subject, index) => (
                                            <li key={index} className='text-gray-600 text-sm'>
                                                {subject.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {selectedBook.summary && (
                                    <p className='text-gray-700 mb-4'>
                                        <span className='font-semibold'>Summary:</span> {selectedBook.summary}
                                    </p>
                                )}
                                {selectedBook.rating && (
                                    <p className='text-gray-700'>
                                        <span className='font-semibold'>Rating:</span> {selectedBook.rating} / 5
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                }
                modalFooter={
                    <>
                        <Button onPress={() => dispatch(updateBookStatusUsecase({ status: 'rejected', bookId: selectedBook.id, userRole: 'admin' }))}>Refuser</Button>
                        <Button onPress={() => dispatch(updateBookStatusUsecase({ status: 'accepted', bookId: selectedBook.id, userRole: 'admin' }))}>Accepter</Button>
                    </>
                }
            />
        )
    );
};
