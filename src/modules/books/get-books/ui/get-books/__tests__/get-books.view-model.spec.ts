import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/store/create-store';
import { getBooksViewModel, gettingBooks } from '@/modules/books/get-books/ui/get-books/get-books.viewmodel';

describe('test for the viewModel layer of getting books', () => {
    it('should handle loading when getting books is pending', () => {
        const initialState = stateBuilder().withPendingRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.pending, pendingRequest: true });
    });
    it('should handle the error when getting books is rejected', () => {
        const initialState = stateBuilder().withRejectedRequest(true).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.rejected, rejectedRequest: true });
    })
    it('should handle the book list when getting books is fulfilled', () => {
        const payload = {
            connectedUser: true,
            books: [
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
                    subject: [
                        {
                            subject: {
                                id: 1,
                                label: 'Fantasy Medieval'
                            }
                        }
                    ],
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
                    subject: [
                        {
                            subject: {
                                id: 2,
                                label: 'Romance'
                            }
                        }
                    ],
                    image: 'test',
                    dateOfPublication: '2023'
                }
            ]
        };
        const initialState = stateBuilder().withSuccess(payload).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.fulfilled, books: payload.books });
    })
})
