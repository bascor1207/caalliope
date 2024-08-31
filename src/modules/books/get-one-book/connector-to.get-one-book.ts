import { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToGetOneBook {
    getOneBookByAuthor(authorName: string): Promise<Partial<BooksModel.Book>>;
    getOneBookById(id: number): Promise<Partial<BooksModel.Book>>;
}
