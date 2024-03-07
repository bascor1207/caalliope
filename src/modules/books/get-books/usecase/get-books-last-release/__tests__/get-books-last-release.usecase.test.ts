import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from "@/modules/books/get-books/infra/fake-get-books-gateway";
import { createTestStore } from "@/modules/store/create-store";
import { getBooksLastReleaseUseCase } from "../get-books-last-release.usecase";
import { stateBuilder } from "../__tests__/state-builder";
import { Book } from '../../../connector-to.get-books';

describe('test to retrieve a list of last release books', () => {
    it('should retrieve a list of last release books', async () => {
        givenWantingToRetrieveBooksLastRelease(books);

        await whenUserFetchCatalogPage();

        thenTheUserShouldSeeBooksLastRelease(books);
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter })

const givenWantingToRetrieveBooksLastRelease = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse  = payload;
}

const whenUserFetchCatalogPage = async () => {
    await store.dispatch(getBooksLastReleaseUseCase());
}
const thenTheUserShouldSeeBooksLastRelease = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState())
};

const books: Book[] = [
    {
        title: "novel title",
        author: "Bastien Corré",
        type: "Novel",
        subject: "Fantasy Medieval",
        image: "test",
        dateOfPublication: "2023"
    }
];
