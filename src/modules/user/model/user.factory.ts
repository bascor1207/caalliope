import { UsersModel } from '@/modules/user/model/users.model';

export class UserFactory {
    static create(data?: object) : UsersModel.User {
        return ({
            id: '1',
            username: 'John',
            firstName: 'John',
            lastName: 'Doe',
            password: 'secret_password',
            myAbandonedBooks: [],
            myAlreadyReadBooks: [],
            myWishlist: [],
            myBooksToRead: [],
            myInProgressBooks: [],
            avatar: {
                url: '/avatar.jpg'
            },
            email: 'john.doe@doe.john.com',
            roles: [],
            ...data
        })
    }
}
