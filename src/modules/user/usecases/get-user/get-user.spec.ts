import { describe, it, expect } from 'vitest';
import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';
import { createTestState, createTestStore } from '@/modules/store/create-store';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';
import { UserFactory } from '@/modules/user/model/user.factory';


describe('Get user happy path', () => {
    it('should get the user given the id 1', async () => {
        givenUserId('1');

        await retrieveUser()

        thenItShouldBeAUserInStore()
    });

    it('should get the user given the id 2', async () => {
        givenUserId('2');

        await retrieveUser()

        thenItShouldBeAUserInStore()
    })
})

describe('Get user error', () => {
    it('should not get the user given no id', async () => {
        givenUserId('');

        await retrieveUser()

        thenThereShouldBeNoUserInStore();

    })
})

const fakeUserGateway = new FakeUserGateway()
const store = createTestStore({ userAdapter: fakeUserGateway })

function givenUserId(id: string) {
   fakeUserGateway.userId = id;
}

async function retrieveUser() {
    await store.dispatch(getUserUsecase(fakeUserGateway.userId))
}

function thenItShouldBeAUserInStore() {
    const state = createTestState({ user: { getUser: { activeUser: UserFactory.create({ id: fakeUserGateway.userId }) } } })
    expect(store.getState().user?.getUser).toEqual(state.user?.getUser)
}

function thenThereShouldBeNoUserInStore() {
    expect(store.getState().user.getUser).toEqual({ activeUser: {} })
}
