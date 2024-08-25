import { AuthModel } from '@/modules/auth/model/auth.model';

export interface ConnectorToAuthGateway {
    authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser>
    register (data: AuthModel.LoginFormSchema): Promise<unknown>
}
