import { UsersModel } from '@/modules/user/model/users.model';

export interface ConnectorToUserGateway {
    getUser(id: string): Promise<UsersModel.User>
}
