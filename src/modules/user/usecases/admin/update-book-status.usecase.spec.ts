import { describe, test, expect } from 'vitest';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { updateBookStatusUsecase } from '@/modules/user/usecases/admin/update-book-status.usecase';

import { FakeAdminGateway } from '@/modules/user/usecases/admin/infra/fake-admin.gateway';

describe('Update book status by an admin', () => {
    test('Happy path with accepted status', async () => {
        givenBookId(1);
        givenUser('admin');

        await updateBookStatus('accepted');

       thenTheAdminShouldSeeAnInformativeToast();
    });

    test('Given a no admin user', async () => {
        givenBookId(1);
        givenUser('user');

        await updateBookStatus('accepted');

        thenTheUserShouldSeeAnInformativeToast('You are not an admin, please contact an admin');
    });

    test('Given invalid book id and admin user', async () => {
        givenBookId(0);
        givenUser('admin');

        await updateBookStatus('accepted');

        thenTheUserShouldSeeAnInformativeToast('The book has no ID to update');
    });

    test('No found book given the id and admin user', async () => {
        givenBookId(635);
        givenUser('admin');

        await updateBookStatus('accepted');

        thenTheUserShouldSeeAnInformativeToast('No book found with this ID');
    });

});

const fakeAdminGateway = new FakeAdminGateway();
const store = createTestStore({ adminAdapter: fakeAdminGateway });

function givenBookId(id: number) {
    fakeAdminGateway.bookId = id;
}

function givenUser(role: 'admin' | 'user' | Array<'admin' | 'user'>) {
   fakeAdminGateway.userRole = role;
}

async function updateBookStatus(status: 'rejected' | 'accepted') {
   await store.dispatch(updateBookStatusUsecase({ status, bookId: fakeAdminGateway.bookId, userRole: fakeAdminGateway.userRole }));
}

function thenTheAdminShouldSeeAnInformativeToast() {
    const state = createTestState({
        updateBook: { success: true },
        user: {
            getUser: {
                activeProfileTab: 'my-infos',
                activeUser: {},
                contactFormState: 'hidden',
                editProfileFormState: 'hidden',
                informativeSpinner: false,
                informativeToast: { status: 'displayed', message: 'Book status updated', type: 'success' }
            }
        }
    });
    expect(state).toEqual(store.getState());
}

function thenTheUserShouldSeeAnInformativeToast(message: string) {
    const state = createTestState({
        updateBook: { success: false },
        user: {
            getUser: {
                activeProfileTab: 'my-infos',
                activeUser: {},
                contactFormState: 'hidden',
                editProfileFormState: 'hidden',
                informativeSpinner: false,
                informativeToast: { status: 'displayed', message, type: 'error' }
            }
        }
    });
    expect(state).toEqual(store.getState());
}
