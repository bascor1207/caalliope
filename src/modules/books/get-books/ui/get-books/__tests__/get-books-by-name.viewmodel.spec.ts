import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/app/core/store/create-store';
import { getBooksByNameViewmodel } from '../get-books-by-name.viewmodel';
import { BooksModel } from '@/modules/books/model/books.model';

describe('test to retrieve a books by name inside store', () => {
  it('should return books with name containing the query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const book = getBooksByNameViewmodel('tit')(state);

    expect(book).toStrictEqual([booksList[0]])
  });

  it('should return books with name containing the minimal query', () => {
    const initialState = stateBuilder().withSuccess({ books: booksList }).build();
    const state = createTestStore({}, initialState).getState();
    const book = getBooksByNameViewmodel('o')(state);

    expect(book).toStrictEqual(booksList);
  })
})

const booksList: BooksModel.Book[] = [
    {
        id: 1,
        title: 'novel title',
        author: {
            id: 1,
            lastname: 'Corre',
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
    },
    {
        id: 2,
        title: 'novel title',
        author: {
            id: 1,
            lastname: 'Corre',
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
    }
];
