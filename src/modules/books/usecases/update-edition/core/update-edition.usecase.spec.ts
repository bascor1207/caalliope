import { describe, test, expect } from 'vitest';


import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { updateEditionUsecase } from '@/modules/books/usecases/update-edition/core/update-edition.usecase';

import { FakeUpdateEditionGateway } from '@/modules/books/usecases/update-edition/infra/fake-update-edition.gateway';

describe('Test suite to update a edition', () => {
    test('Happy path', async () => {
        givenAEditionToUpdate({ id: 1 })

        await updatingEdition(BookFactory.createPayloadForEditionUpdate())

        thenThereShouldBeAVisualIndicator()
    });

    test('Error in edition update caused by no payload', async () => {
        await updatingEdition({} as BooksModel.EditBookEditionForm);

        thenThereShouldBeAnErrorToast();
    });

    test('Error in edition update caused by no edition to update retrieved', async () => {
        givenAEditionToUpdate({} as {id: number})

        thenThereShouldBeAnErrorToast();
    })
})

const fakeUpdateEditionGateway = new FakeUpdateEditionGateway();
const store = createTestStore({ updateEditionAdapter: fakeUpdateEditionGateway })

function givenAEditionToUpdate({ id }: {id: number}) {
    fakeUpdateEditionGateway.editionToUpdate = fakeUpdateEditionGateway.books.find((book) => book.id === id);
}

async function updatingEdition(payload: BooksModel.EditBookEditionForm ) {
    await store.dispatch(updateEditionUsecase(payload))
}

function thenThereShouldBeAVisualIndicator() {
    const state = createTestState({
        user: {
            getUser: {
                informativeSpinner: false,
                informativeToast: { type: 'success', message: 'The demand will be proceeded by an admin', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {},
                editProfileFormState: 'hidden',
                contactFormState: 'hidden'
            },
            actions: {
                updateEdition: { success: true, error: false },
                updateBook: { success: false, error: false }
            }
        }
    });
    expect(state).toEqual(store.getState());
}

function thenThereShouldBeAnErrorToast() {
    const state = createTestState({
        user: {
            getUser: {
                informativeSpinner: false,
                informativeToast: { type: 'error', message: 'There was an error trying update the edition, please retry later', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {},
                editProfileFormState: 'hidden',
                contactFormState: 'hidden'
            },
            actions: {
                updateEdition: { success: false, error: true }
            }
        }
    });
    expect(store.getState()).toEqual(state)
}
