import { describe, test, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { createEditionUsecase } from '@/modules/books/usecases/create-edition/core/create-editon.usecase';

import { FakeCreateEditionGateway } from '@/modules/books/usecases/create-edition/infra/fake-create-edition.gateway';

describe('Test suite to create a book', () => {
    test('Happy path', async () => {
        await whenRegisteringEditionData(BookFactory.createPayloadForEditionCreation());

        thenThereShouldBeASuccessfulToast();
    });

    test('Error in book creation', async () => {
        await whenRegisteringEditionData({} as BooksModel.AddBookEditionForm);

        thenThereShouldBeAnErrorToast();
    })
})

const fakeCreateEditionGateway = new FakeCreateEditionGateway();

const store = createTestStore({ createEditionAdapter: fakeCreateEditionGateway })

async function whenRegisteringEditionData(payload: BooksModel.AddBookEditionForm) {
    await store.dispatch(createEditionUsecase(payload));
}

function thenThereShouldBeASuccessfulToast() {
    const state = createTestState({
        editionCreation: { createEdition: { success: true, error: false } },
        user: { getUser: {
            informativeToast: { type: 'success', message: 'The demand will be proceeded by an admin', status: 'displayed' },
            activeProfileTab: 'my-infos',
            activeUser: {}
        } }
    });
    expect(store.getState()).toEqual(state)
}

function thenThereShouldBeAnErrorToast() {
    const state = createTestState({
        editionCreation: { createEdition: { success: false, error: true } },
        user: { getUser: {
                informativeToast: { type: 'error', message: 'There was an error trying create the book, please retry later', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {}
            } }
    });
    expect(store.getState()).toEqual(state)
}
