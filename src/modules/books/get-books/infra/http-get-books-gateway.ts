import axios from 'axios';

import { Book, ConnectorToGetBooks  } from '@/modules/books/get-books/connector-to.get-books';

export class HttpGetBooksGateway implements ConnectorToGetBooks {
    async getBooks(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }

    async getBooksLastRelease(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }
}
