import type { UsersModel } from '@/modules/user/core/model/users.model';

import { UserFactory } from '@/modules/user/core/model/user.factory';

export class UserModuleTestingUtils {

    static setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({
                id: '2',
                roles: ['admin'],
                myBooksToRead,
                myInProgressBooks,
                myAlreadyReadBooks,
                myAbandonedBooks,
                myWishlist,
                waitingForValidationBooks
            })
        ])
    }

    static setupBooks() {
        let i = 0;
        const books = []
        while (i < 11) {
            books.push(UserFactory.createBaseUserBook({ id: i + 19 }))
            i++
        }
        return books;
    }
}

export const myBooksToRead: UsersModel.ToReadBook[] = [
    { id: 1, title: 'Book 1', type: 'Fiction', image: '/livre1.jpg', status: 'toRead' },
    { id: 2, title: 'Book 2', type: 'Science', image: '/livre1.jpg', status: 'toRead' },
];

export const myInProgressBooks: UsersModel.InProgressBook[] = [
    { id: 3, title: 'Book 3', type: 'History', image: '/livre1.jpg', status: 'reading' },
    { id: 4, title: 'Book 4', type: 'Fantasy', image: '/livre1.jpg', status: 'reading' },
];

export const myAlreadyReadBooks: UsersModel.AlreadyReadBook[] = [
    { id: 5, title: 'Book 5', type: 'Biography', image: '/livre1.jpg', status: 'read' },
    { id: 6, title: 'Book 6', type: 'Mystery', image: '/livre1.jpg', status: 'read' },
];

export const myAbandonedBooks: UsersModel.AbandonedBook[] = [
    { id: 7, title: 'Book 7', type: 'Thriller', image: '/livre1.jpg', status: 'abandoned' },
    { id: 8, title: 'Book 8', type: 'Romance', image: '/livre1.jpg', status: 'abandoned' },
];

export const myWishlist: UsersModel.WishBook[] = [
    { id: 9, title: 'Book 9', type: 'Adventure', image: '/livre1.jpg', status: 'wishlist' },
    { id: 10, title: 'Book 10', type: 'Philosophy', image: '/livre1.jpg', status: 'wishlist' },
];

export const waitingForValidationBooks: UsersModel.BaseUserBook[] = [
    { id: 11, title: 'Book 11', type: 'History', image: '/livre1.jpg', status: '' },
    { id: 12, title: 'Book 12', type: 'Fantasy', image: '/livre1.jpg', status: '' },
];
