import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetOneBook {
    getOneBookById(id: number): Promise<BooksModel.BookForCatalog>;
}
