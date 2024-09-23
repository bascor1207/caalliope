import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToLastReleaseBooks {
    getLastReleaseBooks(): Promise<BooksModel.Book[] | void>;
}
