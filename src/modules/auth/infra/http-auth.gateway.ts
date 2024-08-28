import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CookiesProvider } from '@/modules/app/core/cookies.provider';
import { CookiesInterface } from '@/modules/app/core/cookies.interface';

export class HttpAuthGateway implements ConnectorToAuthGateway {
    private cookiesManager: CookiesInterface = new CookiesProvider();

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser> {
        const { data } = await axiosInstance.post('/auth/login', { email, password })
        this.cookiesManager.setCookie('token', data.access_token)
        return data
    }

    async register(payload: AuthModel.AuthFormSchema): Promise<unknown> {
        const { data } = await axiosInstance.post('/auth/register', payload)
        return data
    }
}
