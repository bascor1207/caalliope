import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserFactory } from '@/modules/user/core/model/user.factory';

export class FakeUserGateway implements ConnectorToUserGateway {
    private readonly users: UsersModel.User[];
    private readonly books: UsersModel.BaseUserBook[];

    constructor() {
        this.users = this.setupUsers()
        this.books = this.setupBooks()
    }

    getUser({ id }: {id: string}): Promise<UsersModel.User> {
        return new Promise((resolve, reject) => {
            if (!id) reject();
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

    private setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({
                id: '2', roles: ['admin'],
                myBooksToRead, myInProgressBooks, myAlreadyReadBooks, myAbandonedBooks, myWishlist, waitingForValidationBooks
             })
        ])
    }

    private setupBooks() {
        let i = 0;
        const books = []
        while(i < 11) {
            books.push(UserFactory.createBaseUserBook({ id: i + 19 }))
           i++
        }
        return books;
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

const waitingForValidationBooks: UsersModel.BaseUserBook[] = [
    { id: 11, title: 'Book 11', type: 'History', image: '/livre1.jpg', status: '' },
    { id: 12, title: 'Book 12', type: 'Fantasy', image: '/livre1.jpg', status: '' },
];

