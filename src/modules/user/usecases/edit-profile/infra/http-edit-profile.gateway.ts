import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { ConnectorToEditProfileGateway } from '@/modules/user/usecases/edit-profile/core/connector-to-edit-profile.gateway';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpEditProfileGateway implements ConnectorToEditProfileGateway {
    async  editProfile({ userId, payload }: {userId: number, payload: UsersModel.EditProfileForm}): Promise<UsersModel.User | void> {
        try {
            console.log(payload)
            const { data } = await axiosInstance.patch(`/user/${userId}`, payload);
            return data.data;
        } catch (error) {
            CustomErrorWrapper.throwError({ message: 'error.message', type: 'error' })
        }
    }
}
