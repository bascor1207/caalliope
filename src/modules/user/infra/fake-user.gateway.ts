import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type  { UsersModel } from '@/modules/user/core/model/users.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserFactory } from '@/modules/user/core/model/user.factory';
import { UserModuleTestingUtils } from '@/modules/user/testing/utils';

export class FakeUserGateway implements ConnectorToUserGateway {
    private readonly users: UsersModel.User[];
    private readonly books: UsersModel.BaseUserBook[];

    constructor() {
        this.users = UserModuleTestingUtils.setupUsers()
        this.books = UserModuleTestingUtils.setupBooks()
    }

    getUser({ id }: {id: string}): Promise<UsersModel.User> {
        return new Promise((resolve, reject) => {
            if (!id || id.trim() === '') return reject();
            const user = this.users.find((user) => user.id === id);
            if (!user) reject();
            resolve(user as UsersModel.User)
        })
    }

    addBookToUserLibrary({
        userId,
        bookId,
        status,
      }: {
        userId: string;
        bookId: number;
        status:
          | UsersModel.ToReadBook['status']
          | UsersModel.InProgressBook['status']
          | UsersModel.AlreadyReadBook['status']
          | UsersModel.AbandonedBook['status']
          | UsersModel.WishBook['status'];
      }): Promise<void> {
        return new Promise((resolve, reject) => {
          const user = this.users.find((user) => user.id === userId);

          if (!user) {
            return reject('User not found');
          }

          const bookWithStatus = this.books.find((book) => book.id === bookId);

          if (!bookWithStatus) {
              CustomErrorWrapper.throwError({ message: 'No book to update', type: 'error' })
              return;
          }

          switch (status) {
            case 'toRead':
              user.myBooksToRead.push(UserFactory.createBaseUserBook<'toRead'>({ ...bookWithStatus, status }));
              break;
            case 'reading':
              user.myInProgressBooks.push(UserFactory.createBaseUserBook<'reading'>({ ...bookWithStatus, status }));
              break;
            case 'read':
              user.myAlreadyReadBooks.push(UserFactory.createBaseUserBook<'read'>({ ...bookWithStatus, status }));
              break;
            case 'wishlist':
              user.myWishlist.push(UserFactory.createBaseUserBook<'wishlist'>({ ...bookWithStatus, status }));
              break;
            case 'abandoned':
              user.myAbandonedBooks.push(UserFactory.createBaseUserBook<'abandoned'>({ ...bookWithStatus, status }));
              break;
            default:
              return reject('Invalid status');
          }

          resolve();
        });
      }

    async updateUserBookStatus(): Promise<void> {
        return;
    }

    addReview(): Promise<void> {
        return Promise.resolve(undefined);
    }
}

