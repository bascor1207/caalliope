import { describe, it, expect } from 'vitest';

import type { AuthModel } from '@/modules/auth/core/model/auth.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { authUser } from '@/modules/auth/usecases/auth.user';

import { FakeAuthGateway } from '@/modules/auth/infra/fake-auth.gateway';

describe('Test suite for authenticating user', () => {
    it('should authenticate the user with happy path', async () => {
        givenNoUserConnected()

        await authenticateUser({ email: 'email@email.com', password: 'password' })

        itShouldBeAUserThen()
    });

    it('should not authenticate the user', async () => {
        givenNoUserConnected()

        await authenticateUser()

        itShouldNotBeAUserThen()
    })
})

const fakeAuthGateway = new FakeAuthGateway();
const store = createTestStore({ authAdapter: fakeAuthGateway })

function givenNoUserConnected() {
    return true;
}

async function authenticateUser(payload?: AuthModel.AuthUserPayload) {
    if (payload) {
        await store.dispatch(authUser({ ...payload }))
        return
    }
    await store.dispatch(authUser({ email: '', password: '' }))
}

function itShouldBeAUserThen() {
    const state = createTestState({ auth: { getAuth: { loggedUser: true } } })
    expect(state.auth?.getAuth?.loggedUser).toEqual(store.getState().auth?.getAuth?.loggedUser)
}

function itShouldNotBeAUserThen() {
    const state = createTestState({ auth: { getAuth: { authModalVisible: false, loggedUser: false, error: true } } })
    expect(state.auth?.getAuth.loggedUser).toEqual(store.getState().auth?.getAuth.loggedUser)
    expect(state.auth?.getAuth.error).toEqual(store.getState().auth?.getAuth.error)
    expect(state.auth?.getAuth.authModalVisible).toEqual(store.getState().auth?.getAuth.authModalVisible)
}
