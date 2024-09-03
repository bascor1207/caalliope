import { describe, it, expect } from 'vitest';

import type { UsersModel } from '@/modules/user/core/model/users.model';

import { createTestStore } from '@/modules/app/core/store/create-store';

import { FakeUserGateway } from '@/modules/user/infra/fake-user.gateway';

import { AddBookToUserLibraryUseCase } from './add-book-to-user-library.usecase';

describe('Add book to user library', () => {
    it('should add the book to the user\'s to-read list', async () => {
        givenUserId('2');
        givenBookAndStatus('toRead');

        await addBookToLibrary();

        await thenTheBookShouldBeInUserLibrary('toRead');
    });

    it('should add the book to the user\'s wishlist', async () => {
        givenUserId('2');
        givenBookAndStatus('wishlist');

        await addBookToLibrary();

        await thenTheBookShouldBeInUserLibrary('wishlist');
    });
});

const fakeUserGateway = new FakeUserGateway();
const store = createTestStore({ userAdapter: fakeUserGateway });
let book: UsersModel.BaseUserBook;
let userId = '';
let status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned';

function givenUserId(id: string) {
    userId = id;
}

function givenBookAndStatus(bookStatus: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned') {
    status = bookStatus;
    book = {
        id: 11,
        title: 'New Book',
        type: 'Fiction',
        image: '/newbook.jpg',
    };
}

async function addBookToLibrary() {
    await store.dispatch(AddBookToUserLibraryUseCase({ userId, book, status }));
}

async function thenTheBookShouldBeInUserLibrary(expectedStatus: string) {
    const user = await fakeUserGateway.getUser({ id: userId });
    const expectedBook = { ...book, status: expectedStatus };
    if (expectedStatus === 'toRead') {
        expect(user.myBooksToRead).toContainEqual(expectedBook);
    } else if (expectedStatus === 'reading') {
        expect(user.myInProgressBooks).toContainEqual(expectedBook);
    } else if (expectedStatus === 'read') {
        expect(user.myAlreadyReadBooks).toContainEqual(expectedBook);
    } else if (expectedStatus === 'wishlist') {
        expect(user.myWishlist).toContainEqual(expectedBook);
    } else if (expectedStatus === 'abandoned') {
        expect(user.myAbandonedBooks).toContainEqual(expectedBook);
    }
}
