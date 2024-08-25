import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { setCookie } from 'nookies';
import axios from 'axios';

export class HttpAuthGateway implements ConnectorToAuthGateway {

    async authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser> {
        const { data } = await axios.post('http://localhost:3000/auth/login', { email, password })
        setCookie(undefined, 'token', data.access_token)
        return data
    }

    async register(payload: AuthModel.AuthFormSchema): Promise<unknown> {
        const { data } = await axios.post('http://localhost:3000/auth/register', payload)
        return data
    }

}
