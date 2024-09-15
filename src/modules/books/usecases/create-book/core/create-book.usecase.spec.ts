import { describe, test, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';

import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';

describe('Test suite to create a book', () => {
    test('Happy path', async () => {
        await whenRegisteringBookData(BookFactory.createPayloadForBookCreation());

        thenThereShouldBeAnSuccessfulToast();
    });

    test('Error in book creation', async () => {
        await whenRegisteringBookData({} as BooksModel.AddBookFormSchemaType);

        thenThereShouldBeAnErrorToast();
    })
})

const fakeCreateBookGateway = new FakeCreateBookGateway();

const store = createTestStore({ createBookAdapter: fakeCreateBookGateway })

async function whenRegisteringBookData(payload: BooksModel.AddBookFormSchemaType) {
    await store.dispatch(createBookUsecase(payload));
}

function thenThereShouldBeAnSuccessfulToast() {
    const state = createTestState({
        bookCreation: { createBook: { success: true, error: false } },
        user: { getUser: {
            informativeSpinner: false,
            informativeToast: { type: 'success', message: 'The demand will be proceeded by an admin', status: 'displayed' },
            activeProfileTab: 'my-infos',
            activeUser: {},
            contactFormState: 'hidden',
            editProfileFormState: 'hidden'
        } }
    });

    expect(store.getState()).toEqual(state)
}

function thenThereShouldBeAnErrorToast() {
    const state = createTestState({
        bookCreation: { createBook: { success: false, error: true } },
        user: { getUser: {
                informativeSpinner: false,
                informativeToast: { type: 'error', message: 'There was an error trying create the book, please retry later', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {},
                contactFormState: 'hidden',
                editProfileFormState: 'hidden'
            } }
    });
    expect(store.getState()).toEqual(state)
}
