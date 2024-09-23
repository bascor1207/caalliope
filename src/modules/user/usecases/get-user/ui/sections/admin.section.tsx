import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { bookDetailsModal } from '@/modules/books/get-one-book/core/get-book.slice';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { sendCommentValidationUsecase } from '@/modules/user/usecases/admin/infra/send-comment-validation.usecase';
import { UserBookCard } from '@/modules/user/usecases/get-user/ui/components/user-book.card';


export const AdminSection = () => {
    const { t } = useTranslation();
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();

    const bookContent = () => {
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

    const commentsContent = () => {
        return (
            <div className='p-6 space-y-6'>
                {activeUser.waitingForValidationComments?.length === 0 ? (
                    <div className='flex flex-col items-center justify-center w-full h-full'>
                        <div className='text-center text-custom-dark-purple font-semibold'>
                            {t('account.noWaitingComments')}
                        </div>
                    </div>
                ) : (
                    <div className='grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                        {activeUser.waitingForValidationComments?.map((review) => (
                            <div key={review.id} className='flex justify-center'>
                                <CustomCard
                                    content={() => (
                                        <div className='space-y-4 text-sm text-gray-700'>
                                            <p className='font-semibold text-lg text-gray-900'>
                                                {t('account.commentFrom')} {review.username}
                                            </p>
                                            <p className='font-semibold text-lg text-gray-900'>
                                                {t('account.onBook')} {review.bookTitle}
                                            </p>
                                            <p className='italic text-gray-600'>{`"${review.text}"`}</p>
                                            <div className='flex justify-end'>
                                              <span
                                                  className={
                                                  `text-xs font-medium px-2 py-1 rounded-lg 
                                                  ${review.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`
                                              }>
                                                {t(review.status === 'waiting' ? 'account.statusWaiting' : 'account.statusValidated')}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                    className='w-full bg-white shadow-lg rounded-xl cursor-default max-w-3xl'
                                    isPressable={false}
                                    footer={() => (
                                        <div
                                            className='flex items-end p-0 m-0 space-x-2'>
                                            <Button
                                                onPress={() => dispatch(sendCommentValidationUsecase({
                                                    status: 'refused',
                                                    commentId: review.id
                                                }))}
                                                className='w-full'
                                            >
                                                {t('account.refuseCommentValidation')}
                                            </Button>
                                            <Button
                                                onPress={() => dispatch(sendCommentValidationUsecase({
                                                    status: 'accepted',
                                                    commentId: review.id
                                                }))}
                                                className='w-full'
                                            >
                                                {t('account.acceptCommentValidation')}
                                            </Button>
                                        </div>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
    const [showBooksCard, setShowBooksCard] = useState(true);
    const [showCommentsCard, setShowCommentsCard] = useState(true);

    return (
        <div className='flex flex-col gap-6'>
            <div>
                <Button onPress={() => setShowBooksCard(!showBooksCard)} className='mb-4'>
                    {showBooksCard ? t('buttons.hide') : t('buttons.show')}
                </Button>
                <div
                    className={`transition-all duration-500 ease-in-out ${showBooksCard ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
                >
                    <CustomCard
                        title={t('account.adminBooksValidation')}
                        content={bookContent}
                        className='w-full bg-white shadow-lg rounded-xl p-6 cursor-default min-h-full'
                        isPressable={false}
                        divider
                    />
                </div>
            </div>

            <div>
                <Button onPress={() => setShowCommentsCard(!showCommentsCard)} className='mb-4'>
                    {showCommentsCard ? t('buttons.hide') : t('buttons.show')}
                </Button>
                <div
                    className={`transition-all duration-500 ease-in-out ${showCommentsCard ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
                >
                    <CustomCard
                        title={t('account.adminCommentsValidation')}
                        content={commentsContent}
                        className='w-full bg-white shadow-lg rounded-xl p-6 cursor-default min-h-full'
                        isPressable={false}
                        divider
                    />
                </div>
            </div>
        </div>
    );
}
