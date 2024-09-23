import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToPopularBooks {
    getPopularBooks(): Promise<BooksModel.Book[] | void>;
}
