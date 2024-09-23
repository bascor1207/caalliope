import { describe, it, expect } from 'vitest';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { UserFactory } from '@/modules/user/core/model/user.factory';
import {
    myAbandonedBooks,
    myAlreadyReadBooks,
    myBooksToRead,
    myInProgressBooks, myWishlist,
    waitingForValidationBooks
} from '@/modules/user/testing/utils';
import { getUserUsecase } from '@/modules/user/usecases/get-user/get-user.usecase';

import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';


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
let id = '';

function givenUserId(userId: string) {
    id = userId
}

async function retrieveUser() {
    await store.dispatch(getUserUsecase({ id }))
}

function thenItShouldBeAUserInStore() {
    let state;
    if (id === '1') {
        state = createTestState({ user: { getUser: { activeUser: UserFactory.create({ id }), activeProfileTab: 'my-infos' } } })
    } else {
        state = createTestState({ user: { getUser: { activeUser: UserFactory.create({ id, myBooksToRead, myInProgressBooks, myAlreadyReadBooks, myAbandonedBooks, myWishlist, roles: ['admin'], waitingForValidationBooks }), activeProfileTab: 'my-infos' } } })
    }
    expect(store.getState().user?.getUser.activeUser).toEqual(state.user?.getUser.activeUser)
}

function thenThereShouldBeNoUserInStore() {
    expect(store.getState().user.getUser.activeUser).toEqual({})
}
