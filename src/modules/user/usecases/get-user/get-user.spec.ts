import { describe, it, expect } from 'vitest';


import type { UsersModel } from '@/modules/user/core/model/users.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { UserFactory } from '@/modules/user/core/model/user.factory';
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

const myBooksToRead: UsersModel.ToReadBook[] = [
    { id: 1, title: 'Book 1', type: 'Fiction', image: '/livre1.jpg', status: 'toRead' },
    { id: 2, title: 'Book 2', type: 'Science', image: '/livre1.jpg', status: 'toRead' },
];

const myInProgressBooks: UsersModel.InProgressBook[] = [
    { id: 3, title: 'Book 3', type: 'History', image: '/livre1.jpg', status: 'reading' },
    { id: 4, title: 'Book 4', type: 'Fantasy', image: '/livre1.jpg', status: 'reading' },
];

const myAlreadyReadBooks: UsersModel.AlreadyReadBook[] = [
    { id: 5, title: 'Book 5', type: 'Biography', image: '/livre1.jpg', status: 'read' },
    { id: 6, title: 'Book 6', type: 'Mystery', image: '/livre1.jpg', status: 'read' },
];

const myAbandonedBooks: UsersModel.AbandonedBook[] = [
    { id: 7, title: 'Book 7', type: 'Thriller', image: '/livre1.jpg', status: 'abandoned' },
    { id: 8, title: 'Book 8', type: 'Romance', image: '/livre1.jpg', status: 'abandoned' },
];

const myWishlist: UsersModel.WishBook[] = [
    { id: 9, title: 'Book 9', type: 'Adventure', image: '/livre1.jpg', status: 'wishlist' },
    { id: 10, title: 'Book 10', type: 'Philosophy', image: '/livre1.jpg', status: 'wishlist' },
];

const waitingForValidationBooks: UsersModel.BaseUserBook[] = [
    { id: 11, title: 'Book 11', type: 'History', image: '/livre1.jpg', status: '' },
    { id: 12, title: 'Book 12', type: 'Fantasy', image: '/livre1.jpg', status: '' },
];
