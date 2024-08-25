import { BooksModel } from '@/modules/books/model/books.model';
import { ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';
import { queryBack } from '@/app/http-utils';

export class HttpGetBooksGateway implements ConnectorToGetBooks {
    private endpoint = queryBack('http://localhost:3000')

    async getBooks(): Promise<BooksModel.Book[]> {
        const booksEndpoint = this.endpoint('/books');
        const { data } =  await booksEndpoint('get');
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


