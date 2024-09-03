import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpGetBooksGateway implements ConnectorToGetBooks {

    async getBooks(): Promise<BooksModel.Book[]> {
        const { data } =  await axiosInstance.get('/book');
        return this.createReturnPayload(data.data);
    }

    getBooksBySearch(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getLastReleaseBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getPopularBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    async getBooksByAuthor(value: string): Promise<BooksModel.Book[]> {
        const { data } =  await axiosInstance.get(`/author/${value}`);
        return this.createReturnPayload(data.data);
    }

    async getBooksByGenre(value: string): Promise<BooksModel.Book[]> {
        const { data } =  await axiosInstance.get(`/genre/${value}`);
        return this.createReturnPayload(data.data);
    }

   async  getBooksByName(value: string): Promise<BooksModel.Book[]> {
        //TODO CREATE BY NAME METHOD IN BACK
        const { data } =  await axiosInstance.get(`/genre/${value}`);
        return this.createReturnPayload(data.data);
    }

    private createReturnPayload(data: BooksModel.GetBooksReturn[]): BooksModel.Book[] {
        return data.map((data) => {
            return {
                id: data.id || 0,
                title: data.title || 'Title not available',
                author: {
                    lastname: data.author?.lastname || 'Unknown lastname',
                    firstname: data.author?.firstname || 'Unknown firstname',
                    image: data.author?.image || '',
                    email: data.author?.email || 'Email not available',
                    birthDate: new Date(data.author?.birthDate).toISOString().split('T')[0] || 'Birthdate not available',
                },
                type: data.type || 'Type not provided',
                subjects: (data.subjects || []).map((subject) => ({
                    id: subject?.id,
                    label: subject?.label || 'No subject provided'
                })),
                dateOfPublication: new Date(data?.publicationDate).toISOString().split('T')[0] || 'Publication date not available',
                image: data.image || '',
                editions: (data.editions || []).map((edition) => ({
                    id: edition?.id,
                    label: edition?.label || 'No edition provided',
                    language: edition?.language || 'No language provided',
                    numberOfPages: edition?.numberOfPages || 1,
                    dateOfPublication: new Date(edition?.dateOfPublication).toISOString().split('T')[0] || 'Publication date not available'
                })),
                rating: data.rating ?? 0,
                summary: data.summary || 'No summary available',
                reviews: (data.reviews || []).map((review) => ({
                    id: review?.id,
                    comment: review?.comment || 'No comment provided',
                    date: new Date(review?.date).toISOString().split('T')[0] || 'No date provided',
                    reviewer: {
                        id: review.reviewer?.id || '',
                        avatar: review.reviewer?.avatar || '',
                        username: review.reviewer?.username || 'Unknown username'
                    }
                })),
            };
        });
    }
}


