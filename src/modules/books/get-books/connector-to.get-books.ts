import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetBooks {
    getBooksBySearch(search: string): Promise<BooksModel.Book[]>;
    getBooks(): Promise<BooksModel.Book[]>;
}
