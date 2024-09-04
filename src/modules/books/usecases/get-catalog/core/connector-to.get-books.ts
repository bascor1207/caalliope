import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getBooks(): Promise<BooksModel.BookForCatalog[]>;
    getBooksByGenre(value: string) : Promise<BooksModel.BookForCatalog[]>;
    getBooksByAuthor(value: string) : Promise<BooksModel.BookForCatalog[]>;
    getBooksByName(value: string) : Promise<BooksModel.BookForCatalog[]>;
}
