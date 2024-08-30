import { describe, it, expect } from 'vitest';
import { stateBuilder } from '../../../usecase/state-builder';
import { createTestStore } from '@/modules/app/core/store/create-store';
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
            ]
        };
        const initialState = stateBuilder().withSuccess(payload).build();
        const state = createTestStore({}, initialState).getState();
        const viewModel = getBooksViewModel()(state);
        expect(viewModel).toEqual({ type: gettingBooks.fulfilled, books: payload.books });
    })
})
