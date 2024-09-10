import type { UsersModel } from '@/modules/user/core/model/users.model';

export interface ConnectorToAdminGateway {
    updateBookStatus(payload: UsersModel.UpdateBookStatusPayload): Promise<UsersModel.UpdateBookStatusResponse>;
}
