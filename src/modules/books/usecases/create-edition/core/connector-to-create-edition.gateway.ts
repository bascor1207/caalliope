import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToCreateEditionGateway {
    create(payload: BooksModel.AddBookEditionForm): Promise<BooksModel.EditionCreation | undefined>
}
