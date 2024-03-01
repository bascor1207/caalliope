import { describe, it, expect } from 'vitest';
import {createTestStore} from "@/modules/store/create-store";
import {FakeGetOneBookGateway} from "@/modules/books/get-one-book/infra/fake-get-one-book.gateway";
import {getOneBookByAuthor} from "@/modules/books/get-one-book/usecase/get-one-book-by-author.usecase";
import {stateBuilder} from "@/modules/books/get-one-book/usecase/state-builder";


describe('test to retrieve one book by author', () => {
    it('should retrieve the book and put it in store', async () => {
        givenExistingBookInBdd({data: book});

        await whenRetrievingBook();

        thenItShouldBe();
    });
});

const fakeGateway = new FakeGetOneBookGateway();
const store = createTestStore({getOneBookAdapter: fakeGateway});

const givenExistingBookInBdd = ({data} : {data: any}) => {
    fakeGateway.returnedResponse = data;
};

const whenRetrievingBook = async () => {
    await store.dispatch(getOneBookByAuthor('Laura Bojon'));
};

const thenItShouldBe = () => {
    const state = stateBuilder().withSuccess(fakeGateway.returnedResponse).build();
    expect(state).toStrictEqual(store.getState());
};

const book = {
    id: '1',
    title: 'Le seigneur des anneaux',
    author: 'Laura bojon',
}


