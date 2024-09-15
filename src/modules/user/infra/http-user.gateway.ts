import type { ConnectorToUserGateway } from '@/modules/user/core/connector-to-user.gateway';
import type { UsersModel } from '@/modules/user/core/model/users.model';

import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpUserGateway implements ConnectorToUserGateway {
    async getUser({ id }: {id: string }): Promise<UsersModel.User> {
        const { data } =  await axiosInstance.get(`/user/${id}`);
        return data.data
    }

    addBookToUserLibrary({ userId, bookId, status }: { userId: string; bookId: number; status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned'; }): Promise<void> {
        console.log(userId, bookId, status);
        throw new Error('Method not implemented.');
    }
}
