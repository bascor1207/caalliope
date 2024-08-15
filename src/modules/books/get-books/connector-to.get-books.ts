import { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getPopularBooks(): Promise<BooksModel.Book[]>;
    getLastReleaseBooks(): Promise<BooksModel.Book[]>;
    getBooksBySearch(search: string): Promise<BooksModel.Book[]>;
    getBooks(/*connectedUser: boolean*/): Promise<BooksModel.Book[]>;
}
