import { jwtVerify } from 'jose';

import type { CookiesInterface } from '@/modules/app/core/cookies.interface';
import type { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

import { HttpCookiesProvider } from '@/modules/app/infra/http-cookies.provider';



export class HttpAuthGateway implements ConnectorToAuthGateway {
    private cookiesManager: CookiesInterface = new HttpCookiesProvider();

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser | void> {
        try {

        const { data } = await axiosInstance.post('/auth/login', { email, password })
        this.cookiesManager.setCookie('token', data.data.access_token)
        const { payload } = await jwtVerify(data.data.access_token, new TextEncoder().encode('azerty'));
        return { id: payload.sub as string }
        } catch (error) {
            CustomErrorWrapper.throwError({ message: 'Erreur lors de l\'authentification', type: 'error' });
        }
    }

    async register(payload: AuthModel.AuthFormSchema): Promise<AuthModel.RegisteredUser> {
        const { data }: { data: { data: AuthModel.RegisterUserReturn } } = await axiosInstance.post('/auth/register', payload)
        return {
            id: data.data.id.toString(),
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
            username: data.data.username,
            roles: data.data.roles,
            password: data.data.password,
            avatar: {
                url: 'https://example.com/avatar.jpg'
            },
            myWishlist: [],
            myAlreadyReadBooks: [],
            myBooksToRead: [],
            myInProgressBooks: [],
            myAbandonedBooks: []
        }
    }

    async refreshToken(refreshTokenPayload: AuthModel.RefreshTokenPayload): Promise<AuthModel.RefreshedToken> {
        try {
            const { data } = await axiosInstance.post('auth/refresh', { expiredToken: refreshTokenPayload.token });
            this.cookiesManager.setCookie('token', data.data.access_token)
            const { payload } = await jwtVerify(data.data.access_token, new TextEncoder().encode('azerty'));
            return { id: payload.sub as string }
        } catch (error) {
            throw new Error('Erreur lors du refresh token')
        }
    }
}
