import { describe, test, expect } from 'vitest';

import { createTestStore } from '@/modules/app/core/store/create-store';
import { UserFactory } from '@/modules/user/core/model/user.factory';
import { addBookToUserLibraryUseCase, } from '@/modules/user/usecases/add-book-in-user-list/add-book-to-user-library.usecase';

import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';


describe('Add book to user library', () => {
    test('should add the book to the user\'s to-read list', async () => {
        givenUserId('2');
        givenBookAndStatus('toRead');

        await addBookToLibrary(19);

        await thenTheBookShouldBeInUserLibrary('toRead', 19);
    });

    test('should add the book to the user\'s wishlist', async () => {
        givenUserId('2');
        givenBookAndStatus('wishlist');

        await addBookToLibrary(20);

        await thenTheBookShouldBeInUserLibrary('wishlist', 20);
    });
});

const fakeUserGateway = new FakeUserGateway();
const store = createTestStore({ userAdapter: fakeUserGateway });
let userId = '';
let status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned';

function givenUserId(id: string) {
    userId = id;
}

function givenBookAndStatus(bookStatus: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned') {
    status = bookStatus;
}

async function addBookToLibrary(bookId: number) {
    await store.dispatch(addBookToUserLibraryUseCase({ userId, bookId, status }));
}

async function thenTheBookShouldBeInUserLibrary(expectedStatus: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned', bookId: number) {
    const user = await fakeUserGateway.getUser({ id: userId });
    const expectedBook = UserFactory.createBaseUserBook<typeof expectedStatus>({ id: bookId, status: expectedStatus });
    if (expectedStatus === 'toRead') {
        expect(user.myBooksToRead.find((book) => book.id === expectedBook.id)).toEqual(expectedBook);
    }
    if (expectedStatus === 'wishlist') {
        expect(user.myWishlist.find((book) => book.id === expectedBook.id)).toEqual(expectedBook);
    }
}
