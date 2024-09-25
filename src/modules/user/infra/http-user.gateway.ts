import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserFactory } from '@/modules/user/core/model/user.factory';

export class HttpUserGateway implements ConnectorToUserGateway {
    constructor(private readonly translate: TFunction<never, never>) {}

    async getUser({ id }: { id: string }): Promise<UsersModel.User | void> {
        try {
            const { data } = await axiosInstance.get(`/user/${id}`);
            const userData = data.data;
            return UserFactory.create({
                id: userData.id,
                username: userData.username || this.translate('defaultValues.noUsernameProvided'),
                firstName: userData.firstName || this.translate('defaultValues.noFirstNameProvided'),
                lastName: userData.lastName || this.translate('defaultValues.noLastNameProvided'),
                password: userData.password,
                myAbandonedBooks: userData.userBook?.map((book: UsersModel.UserBookFromBack) =>
                    book.status === 'abandoned'
                        ? {
                            id: book.book.id,
                            title: book.book.title,
                            image: book.book.cover ? `${book.book.cover.filename}` : '',
                            status: book.status,
                        }
                        : null
                )
                    .filter((book: UsersModel.AbandonedBook) => book !== null) || [],
                myAlreadyReadBooks: userData.userBook?.map((book: UsersModel.UserBookFromBack) =>
                    book.status === 'read'
                        ? {
                            id: book.book.id,
                            title: book.book.title,
                            image: book.book.cover ? `${book.book.cover.filename}` : '',
                            status: book.status,
                        }
                        : null
                )
                    .filter((book: UsersModel.AlreadyReadBook) => book !== null) || [],
                myWishlist: userData.userBook?.map((book: UsersModel.UserBookFromBack) =>
                    book.status === 'wishlist'
                        ? {
                            id: book.book.id,
                            title: book.book.title,
                            image: book.book.cover ? `${book.book.cover.filename}` : '',
                            status: book.status
                        }
                        : null
                )
                    .filter((book: UsersModel.WishBook) => book !== null) || [],
                myBooksToRead: userData.userBook?.map((book: UsersModel.UserBookFromBack) =>
                    book.status === 'toRead'
                        ? {
                            id: book.book.id,
                            title: book.book.title,
                            image: book.book.cover ? `${book.book.cover.filename}` : '',
                            status: book.status,
                        }
                        : null
                )
                    .filter((book: UsersModel.ToReadBook) => book !== null) || [],
                myInProgressBooks: userData.userBook?.map((book: UsersModel.UserBookFromBack) =>
                    book.status === 'reading'
                        ? {
                            id: book.book.id,
                            title: book.book.title,
                            image: book.book.cover ? `${book.book.cover.filename}` : '',
                            status: book.status,
                        }
                        : null
                )
                    .filter((book: UsersModel.InProgressBook) => book !== null) || [],
                avatar: userData.avatar ? `${process.env.NEXT_PUBLIC_AVATARS_URL}/${userData.avatar.filename}` : '',
                email: userData.email || this.translate('defaultValues.noEmailProvided'),
                roles: Array.isArray(userData.role) ? userData.role : [userData.role || ''],
                waitingForValidationBooks: userData.bookWaiting?.map((book: UsersModel.ProfileBookFromBack) => (
                    {
                        id: book.id,
                        title: book.title,
                        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/covers/${book.cover.filename}`,
                        status: book.status
                    }
                )) || [],
                waitingForValidationComments: userData.commentsWaiting?.map((comment: UsersModel.ProfileCommentFromBack) => (
                    {
                        id: comment.id,
                        userId: comment.user.id,
                        username: comment.user.username,
                        bookId: comment.book.id,
                        bookTitle: comment.book.title,
                        status: comment.status,
                        text: comment.content
                    }
                )) || []
            }) || {};
        } catch (error) {
            console.log(error);
            CustomErrorWrapper.throwError({ message: this.translate('error.gettingData'), type: 'error' });
        }
    }

    async addBookToUserLibrary({ userId, bookId, status }: { userId: string; bookId: number; status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned'; }): Promise<UsersModel.UpdateBookStatusResponse | void> {
        try {
            await axiosInstance.post('/user-book', { userId: parseInt(userId), bookId: bookId, status });
            return {
                message: this.translate('success.bookAdded', { status: this.translate(status) }),
                type: 'success'
            }
        } catch (error) {
            CustomErrorWrapper.throwError({ message: this.translate('error.addingBook'), type: 'error' });
        }
    }

    async updateUserBookStatus({ userId, bookId, status }: { userId: string; bookId: number; status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned'; }): Promise<UsersModel.UpdateBookStatusResponse | void> {
        try {
            await axiosInstance.put('/user-book', { userId: parseInt(userId), bookId: bookId, status });
            return {
                message: this.translate('success.bookStatusUpdated'),
                type: 'success'
            };
        } catch (error) {
            CustomErrorWrapper.throwError({ message: this.translate('error.updatingStatus'), type: 'error' });
        }
    }

    async addReview({ userId, bookId, payload }: { userId: number; bookId: number; payload: { review: string }; }): Promise<UsersModel.UpdateBookStatusResponse | void> {
        try {
            await axiosInstance.post('/comment', { userId, bookId, content: payload.review });
            return {
                message: this.translate('success.bookStatusUpdated'),
                type: 'success'
            };
        } catch (error) {
            CustomErrorWrapper.throwError({ message: this.translate('error.addingReview'), type: 'error' });
        }
    }
}
