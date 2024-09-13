import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToCreateEditionGateway } from '@/modules/books/usecases/create-edition/core/connector-to-create-edition.gateway';

import { axiosInstance } from '@/modules/app/core/axios-instance';
import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class HttpCreateEditionGateway implements ConnectorToCreateEditionGateway {

    async create(payload: BooksModel.AddBookEditionForm): Promise<BooksModel.InformUser | undefined> {
        try {
            await axiosInstance.post('/publishing', payload)
            return { message: 'La requête sera soumise à un administrateur', type: 'success', status: 'displayed' };
        } catch (error) {
            CustomErrorWrapper.throwError({ message: 'Erreur imprévue', type: 'error', status: 'displayed' })
        }
    }
}
