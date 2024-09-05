import type { BooksModel } from '@/modules/books/model/books.model';

export interface ConnectorToUpdateEditionGateway {
    updateEdition(payload: BooksModel.EditBookEditionForm): Promise<BooksModel.InformUser | undefined>
}
