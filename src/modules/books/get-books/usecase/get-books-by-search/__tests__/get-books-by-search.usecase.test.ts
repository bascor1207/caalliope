import { describe, it, expect } from 'vitest';
import { FakeGetBooksGateway } from "@/modules/books/get-books/infra/fake-get-books-gateway";
import { createTestStore } from "@/modules/store/create-store";
import { getBooksBySearchUseCase } from "../get-books-by-search.usecase";
import {stateBuilder} from "./state-builder";
import { Book } from '../../../connector-to.get-books';

describe('test to retrieve a list of books by search', () => {
    it('should retrieve a list of books by search', async () => {
        givenWantingToRetrieveBooksBySearch(books);

        await whenRetrievingBooksBySearch();

        thenTheUserShouldSeeBooksBySearch(books);
    })
});

const fakeGetBooksAdapter = new FakeGetBooksGateway();
const store = createTestStore({ getBooksAdapter: fakeGetBooksAdapter });

const givenWantingToRetrieveBooksBySearch = (payload: typeof books) => {
    fakeGetBooksAdapter.returnedResponse = payload;
};

const whenRetrievingBooksBySearch = async () => {
    await store.dispatch(getBooksBySearchUseCase('novel title'));
};

const thenTheUserShouldSeeBooksBySearch = (payload: typeof books): void => {
    const state = stateBuilder().withSuccess(payload).build();
    expect(state).toEqual(store.getState());
};

const books: Book[] = [
    {
        id: 1,
        title: "novel title",
        author: "Bastien Corré",
        type: "Novel",
        subject: "Fantasy Medieval",
        image: "test",
        dateOfPublication: "2023"
    }
];
