

import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserFactory } from '@/modules/user/core/model/user.factory';

export class HttpUserGateway implements ConnectorToUserGateway {
    async getUser({ id }: { id: string }): Promise<UsersModel.User | void> {
        try {
            const { data } = await axiosInstance.get(`/user/${id}`);
            const userData = data.data;
            return UserFactory.create({
                id: userData.id,
                username: userData.username || 'No username given, please update your profile',
                firstName: userData.firstName || 'No firstname given, please update your profile',
                lastName: userData.lastName || 'No lastname given, please update your profile',
                password: userData.password,
                myAbandonedBooks: userData.myAbandonedBooks || [],
                myAlreadyReadBooks: userData.myAlreadyReadBooks || [],
                myWishlist: userData.myWishlist || [],
                myBooksToRead: userData.myBooksToRead || [],
                myInProgressBooks: userData.myInProgressBooks || [],
                avatar: userData.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/avatars/${userData.avatar}` : '',
                email: userData.email || 'No email given, please update your profile',
                roles: [userData.role].flat() || [],
                waitingForValidationBooks: userData.bookWaiting.map((book: UsersModel.ProfileBookFromBack) => (
                    {
                        id: book.id,
                        title: book.title,
                        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/covers/${book.cover.filename}`,
                        status: book.status
                    }
                )) || []
            })|| {};
        } catch (error) {
            CustomErrorWrapper.throwError({ message: 'Error while getting your data, please contact an admin', type: 'error' })
        }
    }

    addBookToUserLibrary({ userId, bookId, status }: { userId: string; bookId: number; status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned'; }): Promise<void> {
        console.log(userId, bookId, status);
        throw new Error('Method not implemented.');
    }
}
