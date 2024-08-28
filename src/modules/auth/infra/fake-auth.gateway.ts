import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { undefined } from 'zod';
import { CookiesProvider } from '@/modules/app/core/cookies.provider';

export class FakeAuthGateway implements ConnectorToAuthGateway {
    private readonly systemCookiesProvider = new CookiesProvider()

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser> {
        return new Promise((resolve, reject) => {
            if (email.trim() === '' || password.trim() === '') {
                reject(new Error('There is a missing requirement'))
            }
            this.systemCookiesProvider.setCookie('token', 'my-token')
            return resolve({ id: 2, access_token: 'my-token' })
        })
    }

    register(): Promise<unknown> {
        return Promise.resolve(undefined);
    }
}
