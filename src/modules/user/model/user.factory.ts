import { UsersModel } from '@/modules/user/model/users.model';

export class UserFactory {
    static create(data?: object) : UsersModel.User {
        return ({
            id: '1',
            username: 'John',
            firstName: 'John',
            lastName: 'Doe',
            myAbandonedBooks: [],
            myAlreadyReadBooks: [],
            myWishlist: [],
            myBooksToRead: [],
            myInProgressBooks: [],
            avatar: {},
            email: 'john.doe@doe.john.com',
            roles: [],
            ...data
        })
    }
}
