import { describe, test, expect } from 'vitest';

import type { UsersModel } from '@/modules/user/core/model/users.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { UserModuleTestingUtils } from '@/modules/user/testing/utils';
import { editProfileUsecase } from '@/modules/user/usecases/edit-profile/core/edit-profile.usecase';

import { FakeEditProfileGateway } from '@/modules/user/usecases/edit-profile/infra/fake-edit-profile.gateway';

describe('EditProfile usecase', () => {
    test('Happy path when editing profile informations', async () => {
        givenAUserToUpdate(1);

        await updatingProfile({ username: 'newUsername', email: 'newEmail', password: 'newPassword' });

        thenTheUserShouldBeUpdated();
    });

    test('Should not update the value given empty data', async () => {
        givenAUserToUpdate(1);

        await updatingProfile({ username: 'Toto', email: '', password: '' });

        thenTheUserShouldBePartiallyUpdated();
    });

    test('Should not update the user if the user does not exist', async () => {
        givenAUserToUpdate(0);

        await updatingProfile({ username: 'newUsername', email: 'newEmail', password: 'newPassword' });

        thenTheUserShouldNotBeUpdated();
    });
});

const fakeEditProfileGateway = new FakeEditProfileGateway();
const store = createTestStore({ editProfileAdapter: fakeEditProfileGateway });

function givenAUserToUpdate(id: number) {
    fakeEditProfileGateway.users = UserModuleTestingUtils.setupUsers();
    fakeEditProfileGateway.userId = id;
}

async function updatingProfile(payload: UsersModel.EditProfileForm) {
    await store.dispatch(editProfileUsecase({ userId: fakeEditProfileGateway.userId, payload }))
}

function thenTheUserShouldBeUpdated() {
    const state = createTestState({
        user: {
            getUser: {
                activeUser: {
                    ...fakeEditProfileGateway.users[0],
                    username: 'newUsername',
                    email: 'newEmail',
                    password: 'newPassword'
                }
            }
        }
    });

    expect(store.getState().user?.getUser.activeUser).toEqual(state.user?.getUser.activeUser)
    expect(store.getState().user.getUser.informativeToast).toEqual({ message: 'Profile updated', type: 'success', status: 'displayed' })
}

function thenTheUserShouldBePartiallyUpdated() {
    const state = createTestState({
        user: {
            getUser: {
                activeUser: {
                    ...fakeEditProfileGateway.users[0],
                    username: 'Toto'
                }
            }
        }
    });
    expect(store.getState().user?.getUser.activeUser).toEqual(state.user?.getUser.activeUser)
}

function thenTheUserShouldNotBeUpdated() {
    expect(store.getState().user.getUser.informativeToast).toEqual({ message: 'User not found', type: 'error', status: 'displayed' })
}
