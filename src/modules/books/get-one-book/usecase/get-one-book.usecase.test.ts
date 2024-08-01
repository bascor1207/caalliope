import { describe, it, expect } from 'vitest';
import { createTestStore } from '@/modules/store/create-store';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { stateBuilder } from '@/modules/books/get-one-book/usecase/state-builder';
import { Book } from '../connector-to.get-one-book';


describe('test to retrieve one book by author', () => {
    it('should retrieve the book and put it in store', async () => {
        givenExistingBookInBdd({ data: book });

        await whenRetrievingBook();

        thenItShouldBe();
    });
});

const fakeGateway = new FakeGetOneBookGateway();
const store = createTestStore({ getOneBookAdapter: fakeGateway });

const givenExistingBookInBdd = ({ data } : {data: Book}) => {
    fakeGateway.returnedResponse = data;
};

const whenRetrievingBook = async () => {
    await store.dispatch(getOneBookById(1));
};

const thenItShouldBe = () => {
    const state = stateBuilder().withSuccess(fakeGateway.returnedResponse).build();
    expect(state).toStrictEqual(store.getState());
};

const book = {
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


