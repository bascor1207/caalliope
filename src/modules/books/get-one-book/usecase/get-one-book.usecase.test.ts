import { describe, it, expect } from 'vitest';
import { createTestStore } from '@/modules/store/create-store';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { stateBuilder } from '@/modules/books/get-one-book/usecase/state-builder';
import { BooksModel } from '@/modules/books/model/books.model';
import { BookFactory } from '../../model/books.factory';


describe('test to retrieve one book by id', () => {
    it('should retrieve the book and put it in store', async () => {
        givenExistingBookInBdd({ data: book });

        await whenRetrievingBook();

        thenItShouldBe();
    });
});

const fakeGateway = new FakeGetOneBookGateway();
const store = createTestStore({ getOneBookAdapter: fakeGateway });

const givenExistingBookInBdd = ({ data } : {data: BooksModel.Book}) => {
    fakeGateway.returnedResponse = data;
};

const whenRetrievingBook = async () => {
    await store.dispatch(getOneBookById(1));
};

const thenItShouldBe = () => {
    const state = stateBuilder().withSuccess(fakeGateway.returnedResponse).build();
    expect(state).toStrictEqual(store.getState());
};

const book: BooksModel.Book = BookFactory.create();



