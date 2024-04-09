import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { Book } from '../../../connector-to.get-books';
import { getBooksByAuthorViewmodel } from '../get-books-by-author.viewmodel';

describe('test to retrieve a books by name inside store', () => {
  it('should return books with name containing the query', () => {
    const initialState = stateBuilder().withPendingRequest(true).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('corr')(state);

    expect(books).toStrictEqual(booksList)
  });

  it('should return books with name containing the minimal query', () => {
    const initialState = stateBuilder().withPendingRequest(true).build();
    const state = createTestStore({}, initialState).getState();
    const books = getBooksByAuthorViewmodel('o')(state);

    expect(books).toStrictEqual(booksList);
  })
})

const booksList: Book[] = [
    {
        id: 1,
        title: 'title novel',
        author: {
            id: 1, 
            lastname: 'Corré',
            firstname: 'Bastien',
            image: '',
            email: '',
            birthDate: ''
        },
        type: 'Novel',
        subject: {
            id: 1,
            subject: 'Fantasy Medieval'
        },
        image: 'test',
        dateOfPublication: '2023'
    },
    {
        id: 2,
        title: 'novel2',
        author: {
            id: 1, 
            lastname: 'Corré',
            firstname: 'Bastien',
            image: '',
            email: '',
            birthDate: ''
        },
        type: 'Novel',
        subject: {
            id: 2,
            subject: 'Romance'
        },
        image: 'test',
        dateOfPublication: '2023'
    }
];