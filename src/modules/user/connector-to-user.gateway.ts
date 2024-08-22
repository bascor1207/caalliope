import { UsersModel } from '@/modules/user/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id, token }: {id: string; token?: string}): Promise<UsersModel.User>
}
