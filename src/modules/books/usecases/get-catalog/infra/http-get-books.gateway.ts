import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpGetBooksGateway implements ConnectorToGetBooks {

    async getBooks(): Promise<BooksModel.BookForCatalog[]> {
        const { data } = await axiosInstance.get('/book');
        return this.createReturnPayload(data.data);
    }

    async getBooksByAuthor(value: string): Promise<BooksModel.BookForCatalog[]> {
        const { data } = await axiosInstance.get(`/author/${value}`);
        return this.createReturnPayload(data.data);
    }

    async getBooksByGenre(value: string): Promise<BooksModel.BookForCatalog[]> {
        const { data } = await axiosInstance.get(`/genre/${value}`);
        return this.createReturnPayload(data.data);
    }

    async getBooksByName(value: string): Promise<BooksModel.BookForCatalog[]> {
        //TODO CREATE BY NAME METHOD IN BACK
        const { data } = await axiosInstance.get(`/genre/${value}`);
        return this.createReturnPayload(data.data);
    }

    private createReturnPayload(data: BooksModel.GetBooksReturn[]): BooksModel.BookForCatalog[] {
        return data?.map((data) => {
            return {
                id: data.id || 0,
                image: `http://localhost:3001/uploads/covers/${data.cover?.filename}` || ''
            }
        }) || [];
    }
}