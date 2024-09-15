import { describe, test, expect } from 'vitest';

import type { BooksModel } from '@/modules/books/model/books.model';

import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { BookFactory } from '@/modules/books/model/books.factory';
import { updateBookUsecase } from '@/modules/books/usecases/update-book/core/update-book.usecase';

import { FakeUpdateBookGateway } from '@/modules/books/usecases/update-book/infra/fake-update-book.gateway';

describe('Test suite to update a book', () => {
    test('Happy path', async () => {
        givenABookToUpdate({ id: 1 })

        await updatingBook(BookFactory.createPayloadForBookUpdate())

        thenThereShouldBeAVisualIndicator()
    });

    test('Error in book update caused by no payload', async () => {
        await updatingBook({} as BooksModel.EditBookForm);

        thenThereShouldBeAnErrorToast();
    });

    test('Error in book update caused by no book to update retrieved', async () => {
        givenABookToUpdate({} as {id: number})

        thenThereShouldBeAnErrorToast();
    })
})

const fakeUpdateBookGateway = new FakeUpdateBookGateway();
const store = createTestStore({ updateBookAdapter: fakeUpdateBookGateway })

function givenABookToUpdate({ id }: {id: number}) {
    fakeUpdateBookGateway.bookToUpdate = fakeUpdateBookGateway.books.find((book) => book.id === id);
}

async function updatingBook(payload: BooksModel.EditBookForm ) {
    await store.dispatch(updateBookUsecase(payload))
}

function thenThereShouldBeAVisualIndicator() {
    const state = createTestState({
        user: {
            getUser: {
                informativeSpinner: false,
                informativeToast: { type: 'success', message: 'The demand will be proceeded by an admin', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {},
                contactFormState: 'hidden',
                editProfileFormState: 'hidden'
            },
            actions: {
                updateBook: { success: true, error: false }
            }
        }
    });
    expect(store.getState()).toEqual(state);
}

function thenThereShouldBeAnErrorToast() {
    const state = createTestState({
        user: {
            getUser: {
                informativeSpinner: false,
                informativeToast: { type: 'error', message: 'There was an error trying update the book, please retry later', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {},
                contactFormState: 'hidden',
                editProfileFormState: 'hidden'

},
            actions: { updateBook: { success: false, error: true } }
        }
    });
    expect(store.getState()).toEqual(state)
}
