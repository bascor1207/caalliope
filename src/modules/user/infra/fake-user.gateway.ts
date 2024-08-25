import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { UsersModel } from '@/modules/user/model/users.model';
import { UserFactory } from '@/modules/user/model/user.factory';

export class FakeUserGateway implements ConnectorToUserGateway {
    private readonly users: UsersModel.User[];

    constructor() {
        this.users = this.setupUsers()
    }

    getUser({ id }: {id: string}): Promise<UsersModel.User> {
        return new Promise((resolve, reject) => {
            if (!id || id.trim() === '') reject();
            const user = this.users.find((user) => user.id === id);
            if (!user) reject();
            resolve(user as UsersModel.User)
        })
    }

    private setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({ id: '2' })
        ])
    }
}
