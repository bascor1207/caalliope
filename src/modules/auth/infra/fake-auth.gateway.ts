import { ConnectorToAuthGateway } from '@/modules/auth/core/connector-to-auth.gateway';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { undefined } from 'zod';

export class FakeAuthGateway implements ConnectorToAuthGateway{
    async authenticate({ email, password }: AuthModel.AuthUserPayload) {
        return new Promise((resolve, reject) => {
            if (email.trim() === '' || password.trim() === '') {
                reject(new Error('There is a missing requirement'))
            }
            return resolve(true)
        })
    }

    register(data: AuthModel.LoginFormSchema): Promise<unknown> {
        return Promise.resolve(undefined);
    }
}
