import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpGetBooksGateway implements ConnectorToGetBooks {

    constructor(private readonly translate: TFunction<any, any>) {}

    async getBooks(): Promise<BooksModel.BookForCatalog[] | void> {
        try {
            const { data } = await axiosInstance.get('/book');
            return this.createReturnPayload(data.data);
        } catch (error) {
            console.log(error);
            CustomErrorWrapper.throwError({ message: this.translate('error.gettingBooks'), type: 'error' });
        }
    }

    async getBooksByAuthor(value: string): Promise<BooksModel.BookForCatalog[]> {
        const { data } = await axiosInstance.get(`/author/${value}`);
        return this.createReturnPayload(data.data);
    }

    async getBooksByGenre(value: string): Promise<BooksModel.BookForCatalog[] | void> {
        try {
            const { data } = await axiosInstance.get(`/book/genre/${value}`);
            return this.createReturnPayload(data.data);
        } catch (error) {
            console.log(error);
            CustomErrorWrapper.throwError({ message: this.translate('error.gettingBooksByGenre'), type: 'error' });
        }
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
                image: data.cover.filename && data.cover.filename.includes('http') ? `${data.cover?.filename}` : `${process.env.NEXT_PUBLIC_COVERS_URL}/${data.cover?.filename}`,
            };
        }) || [];
    }
}
