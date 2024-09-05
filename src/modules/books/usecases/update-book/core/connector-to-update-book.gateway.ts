import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToUpdateBookGateway {
    updateBook(payload: BooksModel.EditBookForm): Promise<BooksModel.InformUser | undefined>
}
