import { AuthModel } from '@/modules/auth/model/auth.model';

export interface ConnectorToAuthGateway {
    authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<unknown>
}
