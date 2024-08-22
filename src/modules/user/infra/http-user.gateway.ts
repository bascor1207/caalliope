import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { UsersModel } from '@/modules/user/model/users.model';
import axios from 'axios';

export class HttpUserGateway implements ConnectorToUserGateway {
    async getUser({ id, token }: {id: string; token?: string}): Promise<UsersModel.User> {
        const { data } =  await axios.get(`http://localhost:3000/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
                withCredentials: true
        });
        return data.data
    }
}
