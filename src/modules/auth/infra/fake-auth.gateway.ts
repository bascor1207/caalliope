import type { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';

export class FakeAuthGateway implements ConnectorToAuthGateway {
    private readonly systemCookiesProvider = new HttpCookiesProvider()

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser> {
        return new Promise((resolve) => {
            if (email.trim() === '' || password.trim() === '') {
               CustomErrorWrapper.throwError({ message: 'Missing requirement', type: 'error' })
            }
            this.systemCookiesProvider.setCookie('token', 'my-token')
            return resolve({ id: '2' })
        })
    }

    register(): Promise<AuthModel.RegisteredUser> {
        return Promise.resolve({
            id: '123456789',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            username: 'johndoe',
            roles: ['user', 'admin'],
            password: 'motdepasse',
            avatar: {
                url: 'https://example.com/avatar.jpg'
            },
            myWishlist: [],
            myAlreadyReadBooks: [],
            myBooksToRead: [],
            myInProgressBooks: [],
            myAbandonedBooks: []
        });
    }

    refreshToken(): Promise<AuthModel.RefreshedToken> {
        return Promise.resolve({ id: '' })
    }
}
