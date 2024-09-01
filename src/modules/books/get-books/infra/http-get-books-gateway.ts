import { BooksModel } from '@/modules/books/model/books.model';
import { ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';
import { axiosInstance } from '@/modules/app/core/axios-instance';

export class HttpGetBooksGateway implements ConnectorToGetBooks {

    async getBooks(): Promise<BooksModel.Book[]> {
        console.log(process.env.BACK_BASE_URL, 'mzhjfcoçuzhuozuhcu')
        const { data } =  await axiosInstance.get('/book');
        return data;
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
}


