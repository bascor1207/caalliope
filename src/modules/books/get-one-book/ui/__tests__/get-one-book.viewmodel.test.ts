import { describe, it, expect } from 'vitest';
import { createTestStore, RootState } from '@/modules/app/core/store/create-store';
import { stateBuilder } from '@/modules/books/get-one-book/usecase/state-builder';
import { getOneBookViewmodel } from '@/modules/books/get-one-book/ui/get-one-book.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';


describe('test for one book viewmodel', () => {
    it('should return a pending request', () => {
        const initialState = stateBuilder().withPending('pending').build();
        const state = createTestStore({}, initialState).getState();
        thenItShouldReturn(state, { type: 'pending' })
    });

    it('should return a fulfilled request with a book', () => {
        const initialState = stateBuilder().withSuccess(book).build();
        const state = createTestStore({}, initialState).getState();
        thenItShouldReturn(state, { type: 'fulfilled', selectedBook: book })
    })
});

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


const thenItShouldReturn = (state: RootState, response: { type: string, selectedBook?: typeof book }) => {
    const viewmodel = getOneBookViewmodel()(state);
    expect(viewmodel).toStrictEqual(response)
};
