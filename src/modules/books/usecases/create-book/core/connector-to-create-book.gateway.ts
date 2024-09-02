import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToCreateBookGateway {
    create(payload: BooksModel.AddBookFormSchemaType): Promise<BooksModel.BookCreation | undefined>
}
