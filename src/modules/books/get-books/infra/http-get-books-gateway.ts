import axios from 'axios';
import { BooksModel } from '@/modules/books/model/books.model';
import { ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';


export class HttpGetBooksGateway implements ConnectorToGetBooks {
    async getBooks(): Promise<BooksModel.Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as BooksModel.Book[];
    }

    getBooksBySearch(search: string): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getLastReleaseBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }

    getPopularBooks(): Promise<BooksModel.Book[]> {
        return Promise.resolve([]);
    }
}
