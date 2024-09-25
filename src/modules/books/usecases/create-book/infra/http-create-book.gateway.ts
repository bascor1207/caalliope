import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpCreateBookGateway implements ConnectorToCreateBookGateway {
    constructor(private readonly translate: TFunction<never, never>) {}

    async create(payload: BooksModel.AddBookFormSchemaType): Promise<BooksModel.InformUser | undefined> {
        try {
            await axiosInstance.post('/book', payload)
            return { message: this.translate('createBook.requestSubmitted'), type: 'success', status: 'displayed' };
        } catch (error) {
            CustomErrorWrapper.throwError({ message: this.translate('createBook.unexpectedError'), type: 'error', status: 'displayed' })
        }
    }
}
