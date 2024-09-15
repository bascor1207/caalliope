import type { UsersModel } from '@/modules/user/core/model/users.model';

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
            waitingForValidationBooks: [],
            ...data
        })
    }

    static createBaseUserBook<T extends '' | 'abandoned' | 'read' | 'wishlist' | 'toRead' | 'reading' = ''>(data?: Partial<UsersModel.BaseUserBook<T>>): UsersModel.BaseUserBook<T> {
        return ({
            id: 1,
            title: 'titre du livre',
            type: 'type du livre',
            image: 'image.png',
            status: data?.status as T ?? '' as T,
            ...data
        })
    }

    static createAdminBook(data?: Partial<UsersModel.AdminBook>) : UsersModel.AdminBook {
        return ({
            id: 1,
            title: 'title',
            author: {
                id: 1,
                lastname: 'Doe',
                firstname: 'John'
            },
            type: 'type',
            subjects: [{ id: 1, label: 'label' }],
            dateOfPublication: '2022-01-01',
            image: 'image',
            editions: [{ id: 1, label: 'label', language: 'language', numberOfPages: 1, dateOfPublication: '2022-01-01' }],
            summary: 'summary',
            status: 'waiting',
            ...data
        })
    }
}
