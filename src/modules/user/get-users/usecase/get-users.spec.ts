import { describe, it, expect } from 'vitest';
import { createTestStore } from '@/modules/store/create-store';
import { getUsersUseCase } from './get-users.usecase';
import { UsersModel } from '../../model/users.model';
import { UserFactory } from '../../model/user.factory';
import { FakeUserGateway } from '../../infra/fake-user.gateway';
import { stateBuilder } from './state-builder';


describe('Get users happy path', () => {
    it('should retrieve all users', async () => {
        givenAllUsers(users);

        await retrieveUser();

        thenItShouldBeAllUsersInStore();
    })
});

const fakeGetUsersAdapter = new FakeUserGateway();
const store = createTestStore({ userAdapter: fakeGetUsersAdapter })

const givenAllUsers = (users: UsersModel.User[] ) => {
    fakeGetUsersAdapter.returnedResponse  = users;
}

const retrieveUser = async () => {
    await store.dispatch(getUsersUseCase());
}
const thenItShouldBeAllUsersInStore = (): void => {
    const state = stateBuilder().withSuccess({ users }).build();
    expect(state).toEqual(store.getState())
};

const users: UsersModel.User[] = [UserFactory.create()]
