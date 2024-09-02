import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpCreateBookGateway implements ConnectorToCreateBookGateway {
    async create(payload: BooksModel.AddBookFormSchemaType): Promise<BooksModel.BookCreation | undefined> {
        try {
            const { data } = await axiosInstance.post('/book', payload)
            return data;
        } catch (error) {
            CustomErrorWrapper.throwError({ message: 'Erreur imprévue' })
        }
    }
}
