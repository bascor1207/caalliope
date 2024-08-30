import { describe, it, expect } from 'vitest';
import { createTestStore } from '@/modules/store/create-store';
import { FakeGetOneBookGateway } from '@/modules/books/get-one-book/infra/fake-get-one-book.gateway';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';
import { stateBuilder } from '@/modules/books/get-one-book/usecase/state-builder';
import { BooksModel } from '@/modules/books/model/books.model';


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

const book: BooksModel.Book = {
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
    summary: 'summary test',
    type: 'Novel',
    subjects: [
        {
                id: 1,
                label: 'Fantasy Medieval'
        }
    ],
    publishers: [
        {
                id: 1,
                label: 'Lumen',
                language: 'Français',
                numberOfPages: 684,
                dateOfPublication: '2023'
            }
    ],
    reviews: [
        {
            id: 1,
            user: {
                id: '1',
                username: 'username',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'test@gmail.com',
                avatar: {},
                myBooksToRead: [],
                myInProgressBooks: [],
                myAlreadyReadBooks: [],
                myAbandonedBooks: [],
                myWishlist: []
            },
            comment: 'test',
            date: '2023'
        }
    ],
    rating: 4.5,
    dateOfPublication: '2023',
    image: 'test'
};


