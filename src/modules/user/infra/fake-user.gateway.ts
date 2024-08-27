import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { UsersModel } from '@/modules/user/model/users.model';
import { UserFactory } from '@/modules/user/model/user.factory';

export class FakeUserGateway implements ConnectorToUserGateway {
    private readonly users: UsersModel.User[];
    public returnedResponse!: UsersModel.User[];

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

    getUsers(): Promise<UsersModel.User[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            })
        })
    }

    private setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({ id: '2', myBooksToRead, myInProgressBooks, myAlreadyReadBooks, myAbandonedBooks, myWishlist })
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

