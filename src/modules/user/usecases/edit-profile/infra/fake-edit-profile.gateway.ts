import type { UsersModel } from '@/modules/user/core/model/users.model';
import type { ConnectorToEditProfileGateway } from '@/modules/user/usecases/edit-profile/core/connector-to-edit-profile.gateway';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { UserModuleTestingUtils } from '@/modules/user/testing/utils';

export class FakeEditProfileGateway implements ConnectorToEditProfileGateway {
    userId!: number;
    users: UsersModel.User[];

    constructor() {
        this.users = UserModuleTestingUtils.setupUsers();
    }

    async editProfile({ payload }: { payload: UsersModel.EditProfileForm }): Promise<UsersModel.User | void> {
        return new Promise((resolve) => {
            if ((!this.userId && this.userId !== 0) || !payload) {
                CustomErrorWrapper.throwError({ message: 'User id or data is not defined', type:'error' })
            }
            const user = this.users.find((user) => user.id === this.userId.toString());
            if (user) {
                user.username = payload.username || user.username;
                user.email = payload.email || user.email;
                user.password = payload.password || user.password;
                resolve(user)
            }
            CustomErrorWrapper.throwError({ message: 'User not found', type: 'error' })
        })
    }
}
