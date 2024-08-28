import { UsersModel } from '@/modules/user/model/users.model';

export interface ConnectorToUserGateway {
    getUser({ id }: {id: string; }): Promise<UsersModel.User>
}
