import type { AuthModel } from '@/modules/auth/core/model/auth.model';

export interface ConnectorToAuthGateway {
    authenticate({ email, password }: AuthModel.AuthUserPayload): Promise<AuthModel.AuthenticatedUser>
    register (data: AuthModel.LoginFormSchema): Promise<AuthModel.RegisteredUser>
    refreshToken({ token }: AuthModel.RefreshTokenPayload): Promise<AuthModel.RefreshedToken>
}
