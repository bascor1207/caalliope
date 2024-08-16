import axios from 'axios';
import { BooksModel } from '@/modules/books/model/books.model';


export class HttpGetBooksGateway {
    async getBooks(): Promise<BooksModel.Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as BooksModel.Book[];
    }
}
