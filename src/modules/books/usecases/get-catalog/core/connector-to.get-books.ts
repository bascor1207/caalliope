import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getBooks(): Promise<Partial<BooksModel.Book>[]>;
    getBooksByGenre(value: string) : Promise<Partial<BooksModel.Book>[]>;
    getBooksByAuthor(value: string) : Promise<Partial<BooksModel.Book>[]>;
    getBooksByName(value: string) : Promise<Partial<BooksModel.Book>[]>;
}
