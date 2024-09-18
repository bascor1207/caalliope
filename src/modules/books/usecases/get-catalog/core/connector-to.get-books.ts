import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getBooks(): Promise<BooksModel.BookForCatalog[] | void>;
    getBooksByGenre(value: string) : Promise<BooksModel.BookForCatalog[] | void>;
    getBooksByAuthor(value: string) : Promise<BooksModel.BookForCatalog[]>;
    getBooksByName(value: string) : Promise<BooksModel.BookForCatalog[]>;
}
