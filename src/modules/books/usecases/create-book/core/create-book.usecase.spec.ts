import { describe, test, expect } from 'vitest';
import { FakeCreateBookGateway } from '@/modules/books/usecases/create-book/infra/fake-create-book.gateway';
import { BookFactory } from '@/modules/books/model/books.factory';
import { createTestState, createTestStore } from '@/modules/app/core/store/create-store';
import { createBookUsecase } from '@/modules/books/usecases/create-book/core/create-book.usecase';
import { BooksModel } from '@/modules/books/model/books.model';

describe('Test suite to create a book', () => {
    test('Happy path', async () => {
        givenABookToCreate(BookFactory.createPayloadForBookCreation());

        await whenRegisteringBookData();

        thenThereShouldBeAnSuccessfulToast();
    });

    test('Error in book creation', async () => {
        givenABookToCreate();

        await whenRegisteringBookData();

        thenThereShouldBeAnErrorToast();
    })
})

const fakeCreateBookGateway = new FakeCreateBookGateway();
fakeCreateBookGateway.resolvedValue = {
    status: 'displayed',
    message: 'The demand will be proceeded by an admin',
    type: 'success'
}
fakeCreateBookGateway.rejectedValue = {
    status: 'displayed',
    message: 'There was an error trying create the book, please retry later',
    type: 'error'
};
const store = createTestStore({ createBookAdapter: fakeCreateBookGateway })


function givenABookToCreate(payload?: BooksModel.AddBookFormSchemaType) {
    fakeCreateBookGateway.bookToCreate = payload;
}

async function whenRegisteringBookData() {
    await store.dispatch(createBookUsecase(BookFactory.createPayloadForBookCreation()));
}

function thenThereShouldBeAnSuccessfulToast() {
    const state = createTestState({
        bookCreation: { createBook: { success: true, error: false } },
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
        bookCreation: { createBook: { success: false, error: true } },
        user: { getUser: {
                informativeToast: { type: 'error', message: 'There was an error trying create the book, please retry later', status: 'displayed' },
                activeProfileTab: 'my-infos',
                activeUser: {}
            } }
    });
    expect(store.getState()).toEqual(state)
}
