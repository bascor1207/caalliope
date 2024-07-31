import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from '@/modules/books/get-books/infra/fake-get-books-gateway';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksLastReleaseUseCase } from '../get-last-release-books.usecase';
import { stateBuilder } from './state-builder';
import { Book } from '../../../connector-to.get-books';

describe('test to retrieve a list of last release books', () => {
    it('should retrieve a list of last release books', async () => {
        givenWantingToRetrieveBooksLastRelease(books);

        await whenRetrievingBooksLastRelease();

        thenTheUserShouldSeeBooksLastRelease(books);
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })

const givenWantingToRetrieveBooksLastRelease = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse  = payload;
}

const whenRetrievingBooksLastRelease = async () => {
    await store.dispatch(getBooksLastReleaseUseCase());
}
const thenTheUserShouldSeeBooksLastRelease = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: Book[] = [
    {
        id: 1,
        title: 'novel title',
        author: {
            id: 1,
            lastname: 'Medieval',
            firstname: 'Bastien',
            image: 'test',
            email: 'test',
            birthDate: 'test'
        },
        type: 'Novel',
        subject: [
            {
                subject: {
                    id: 1,
                    label: 'Fantasy Medieval'
                }
            }
        ],
        dateOfPublication: '2023',
        image: 'test'
    }
];
