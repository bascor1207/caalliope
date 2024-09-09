import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { UserFactory } from '@/modules/user/core/model/user.factory';

export class FakeUserGateway implements ConnectorToUserGateway {
    private readonly users: UsersModel.User[];

    constructor() {
        this.users = this.setupUsers()
    }

    getUser({ id }: {id: string}): Promise<UsersModel.User> {
        return new Promise((resolve, reject) => {
            if (!id || id.trim() === '') reject();
            const user = this.users.find((user) => user.id === id);
            if (!user) reject();
            resolve(user as UsersModel.User)
        })
    }

    addBookToUserLibrary({
        userId,
        book,
        status,
      }: {
        userId: string;
        book: UsersModel.BaseUserBook;
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

          const bookWithStatus = { ...book, status };

          switch (status) {
            case 'toRead':
              user.myBooksToRead.push(bookWithStatus as UsersModel.ToReadBook);
              break;
            case 'reading':
              user.myInProgressBooks.push(bookWithStatus as UsersModel.InProgressBook);
              break;
            case 'read':
              user.myAlreadyReadBooks.push(bookWithStatus as UsersModel.AlreadyReadBook);
              break;
            case 'wishlist':
              user.myWishlist.push(bookWithStatus as UsersModel.WishBook);
              break;
            case 'abandoned':
              user.myAbandonedBooks.push(bookWithStatus as UsersModel.AbandonedBook);
              break;
            default:
              return reject('Invalid status');
          }

          resolve();
        });
      }

    private setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({ id: '2', myBooksToRead, myInProgressBooks, myAlreadyReadBooks, myAbandonedBooks, myWishlist, roles: ['admin'] })
        ])
    }
}

const myBooksToRead: UsersModel.ToReadBook[] = [
    { id: 1, title: 'Book 1', type: 'Fiction', image: '/livre1.jpg', status: 'toRead' },
    { id: 2, title: 'Book 2', type: 'Science', image: '/livre1.jpg', status: 'toRead' },
];

const myInProgressBooks: UsersModel.InProgressBook[] = [
    { id: 3, title: 'Book 3', type: 'History', image: '/livre1.jpg', status: 'reading' },
    { id: 4, title: 'Book 4', type: 'Fantasy', image: '/livre1.jpg', status: 'reading' },
];

const myAlreadyReadBooks: UsersModel.AlreadyReadBook[] = [
    { id: 5, title: 'Book 5', type: 'Biography', image: '/livre1.jpg', status: 'read' },
    { id: 6, title: 'Book 6', type: 'Mystery', image: '/livre1.jpg', status: 'read' },
];

const myAbandonedBooks: UsersModel.AbandonedBook[] = [
    { id: 7, title: 'Book 7', type: 'Thriller', image: '/livre1.jpg', status: 'abandoned' },
    { id: 8, title: 'Book 8', type: 'Romance', image: '/livre1.jpg', status: 'abandoned' },
];

const myWishlist: UsersModel.WishBook[] = [
    { id: 9, title: 'Book 9', type: 'Adventure', image: '/livre1.jpg', status: 'wishlist' },
    { id: 10, title: 'Book 10', type: 'Philosophy', image: '/livre1.jpg', status: 'wishlist' },
];

