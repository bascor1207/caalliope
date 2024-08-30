import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CookiesProvider } from '@/modules/app/core/cookies.provider';
import { CookiesInterface } from '@/modules/app/core/cookies.interface';
import { jwtVerify } from 'jose';

export class HttpAuthGateway implements ConnectorToAuthGateway {
    private cookiesManager: CookiesInterface = new CookiesProvider();

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser> {
        const { data } = await axiosInstance.post('/auth/login', { email, password })
        this.cookiesManager.setCookie('token', data.data.access_token)
        const { payload } = await jwtVerify(data.data.access_token, new TextEncoder().encode('azerty'));
        return { id: payload.sub as string }
    }

    async register(payload: AuthModel.AuthFormSchema): Promise<AuthModel.RegisteredUser> {
        const { data } : { data: { data: AuthModel.RegisterUserReturn } } = await axiosInstance.post('/auth/register', payload)
        return {
            id: data.data.id.toString(),
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
            username: data.data.username,
            roles: data.data.roles,
            password: data.data.password,
            avatar: {},
            myWishlist: [],
            myAlreadyReadBooks: [],
            myBooksToRead: [],
            myInProgressBooks: [],
            myAbandonedBooks: []
        }
    }

    async refreshToken(refreshTokenPayload: AuthModel.RefreshTokenPayload): Promise<AuthModel.RefreshedToken> {
        try {
            const { data } = await axiosInstance.post('auth/refresh', { refreshToken: refreshTokenPayload.token });
            this.cookiesManager.setCookie('token', data.data.access_token)
            const { payload } = await jwtVerify(data.data.access_token, new TextEncoder().encode('azerty'));
            return { id: payload.sub as string }
        } catch(error) {
            return { id: '' }
        }
    }
}
