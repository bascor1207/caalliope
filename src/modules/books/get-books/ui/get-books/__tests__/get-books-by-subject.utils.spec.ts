import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksBySubjectUtils } from '../get-books-by-subject.utils';
import { Book } from '../../../connector-to.get-books';

describe('test for the viewModel layer of getting books by name or author name', () => {
    it('should return the books which subject match the query', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const books = getBooksBySubjectUtils(state.catalog.getBooks.books, 'fantasy medieval');
        expect(books).toStrictEqual([booksList[0]]);
    });
    it('should handle the error when getting books is rejected', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const books = getBooksBySubjectUtils(state.catalog.getBooks.books, 'romance');
        expect(books).toStrictEqual([booksList[1]]);
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
        title: 'title novel2',
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
