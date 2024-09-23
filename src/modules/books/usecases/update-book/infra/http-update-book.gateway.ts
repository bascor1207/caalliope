
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToUpdateBookGateway } from '@/modules/books/usecases/update-book/core/connector-to-update-book.gateway';
import type { TFunction } from 'i18next';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpUpdateBookGateway implements ConnectorToUpdateBookGateway {
    constructor(private readonly translate: TFunction<never, never>) {}

    async updateBook(): Promise<BooksModel.InformUser | void> {
        return new Promise((resolve) =>
            resolve({
                message: this.translate('success.bookStatusUpdated'),
                type: 'success',
                status: 'displayed'
            }))
    }

    async updateBookRating(payload: { rating: number, bookId: number }): Promise<BooksModel.InformUser & {bookId: number} | void> {
        try {
            const { data } = await axiosInstance.patch(`/book/${payload.bookId}`, { rating: payload.rating, id: payload.bookId });
            return {
                message: this.translate('success.bookStatusUpdated'),
                type: 'success',
                bookId: data.data.id,
            } as BooksModel.InformUser & {bookId: number};
        } catch (error) {
            CustomErrorWrapper.throwError({ message: this.translate('error.updatingStatus'), type: 'error' });
        }
    }

}
