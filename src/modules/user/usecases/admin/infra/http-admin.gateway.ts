import axios from 'axios';

import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { ConnectorToAdminGateway } from '@/modules/user/usecases/admin/core/connector-to-admin.gateway';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpAdminGateway implements ConnectorToAdminGateway {
    async updateBookStatus({ status, bookId }: {
        status: 'refused' | 'accepted',
        bookId: number
    }): Promise<UsersModel.UpdateBookStatusResponse | void> {
        try {
            const { data } = await axiosInstance.patch(`/book/${bookId}`, { status, id: bookId });
            return { message: data.message, type: 'success' };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                CustomErrorWrapper.throwError({ message: error.response?.data.message || error.message, type: 'error' });
            } else {
                CustomErrorWrapper.throwError({ message: 'Unknown error occurred', type: 'error' });
            }
        }
    }
}
