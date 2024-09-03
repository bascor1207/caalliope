import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getBooksBySearch(search: string): Promise<BooksModel.Book[]>;
    getBooks(): Promise<BooksModel.Book[]>;
    getBooksByGenre(value: string) : Promise<BooksModel.Book[]>;
    getBooksByAuthor(value: string) : Promise<BooksModel.Book[]>;
    getBooksByName(value: string) : Promise<BooksModel.Book[]>;
}
