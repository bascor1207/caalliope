import { describe, it, expect } from 'vitest';
import { AppStore, createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { UserFactory } from '@/modules/user/model/user.factory';
import { UsersModel } from '@/modules/user/model/users.model';
import { logoutUserUsecase } from '@/modules/user/usecases/logout-user/logout-user.usecase';
import { FakeCookiesProvider } from '@/modules/app/core/fake-cookies.provider';


describe('Test suite to logout user', () => {
    it('Should be able to logout user', async () => {
        givenTokenInMemory('token', 'my-token')
        givenUserInStore(UserFactory.create())

        await whenLoggingOutUser()

        thenThereShouldBeNoToken()
        thenThereShouldBeNoUser()
    });
});

let store: AppStore;
const fakeCookiesProvider = new FakeCookiesProvider()

function givenTokenInMemory(name: string, value: string){
    fakeCookiesProvider.cookies.set(name, value);
}

function givenUserInStore(user: UsersModel.User){
    const state = createTestState({ user: { getUser: { activeUser: user } } })
    store = createTestStore({ cookiesAdapter: fakeCookiesProvider }, state)
}

async function whenLoggingOutUser(){
    await store.dispatch(logoutUserUsecase())
}

function thenThereShouldBeNoToken(){
    expect(fakeCookiesProvider.cookies).toEqual(new Map())
}

function thenThereShouldBeNoUser(){
    expect(store.getState().user.getUser.activeUser).toEqual({})
    expect(store.getState().auth.getAuth.loggedUser).toEqual(false)
}
