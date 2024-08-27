import { ConnectorToUserGateway } from '@/modules/user/connector-to-user.gateway';
import { UsersModel } from '@/modules/user/model/users.model';
import { UserFactory } from '@/modules/user/model/user.factory';

export class FakeUserGateway implements ConnectorToUserGateway {
    userId!: string;
    private readonly users: UsersModel.User[];
    public returnedResponse!: UsersModel.User[];

    constructor() {
        this.users = this.setupUsers()
    }

    getUser(): Promise<UsersModel.User> {
        return new Promise((resolve, reject) => {
            if (!this.userId || this.userId.trim() === '') reject();
            const user = this.users.find((user) => user.id === this.userId);
            if (!user) reject();
            resolve(user as UsersModel.User)
        })
    }

    getUsers(): Promise<UsersModel.User[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            })
        })
    }

    private setupUsers() {
        return ([
            UserFactory.create(),
            UserFactory.create({ id: '2' })
        ])
    }
}
