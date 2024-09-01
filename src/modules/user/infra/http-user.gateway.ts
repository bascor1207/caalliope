import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { UsersModel } from '@/modules/user/model/users.model';
import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpUserGateway implements ConnectorToUserGateway {
    async getUser({ id }: {id: string }): Promise<UsersModel.User> {
        const { data } =  await axiosInstance.get(`/user/${id}`);
        return data.data
    }
}
