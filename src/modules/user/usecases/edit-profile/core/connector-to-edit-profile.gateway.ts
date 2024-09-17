import type { UsersModel } from '@/modules/user/core/model/users.model';

export interface ConnectorToEditProfileGateway {
    editProfile({ userId, payload }: {userId: number, payload: UsersModel.EditProfileForm}): Promise<UsersModel.User | void>;
}
