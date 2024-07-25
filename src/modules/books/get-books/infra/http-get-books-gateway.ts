import axios from 'axios';
import { Book } from '../connector-to.get-books';

export class HttpGetBooksGateway {
    async getBooks(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }
}
