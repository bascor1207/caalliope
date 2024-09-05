import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class FakeCreateEditionGateway implements ConnectorToCreateBookGateway {
    resolvedValue!: BooksModel.InformUser;
    rejectedValue!: BooksModel.InformUser;

    constructor() {
        this.setup()
    }

    async create(payload: BooksModel.AddBookFormSchemaType): Promise<BooksModel.InformUser> {
        return new Promise((resolve) => {
            if (Object.keys(payload).length < 1) {
                CustomErrorWrapper.throwError(this.rejectedValue)
            }
            resolve(this.resolvedValue)
        })
    }

    private setup() {
        this.resolvedValue = {
            status: 'displayed',
            message: 'The demand will be proceeded by an admin',
            type: 'success'
        }
        this.rejectedValue = {
            status: 'displayed',
            message: 'There was an error trying create the book, please retry later',
            type: 'error'
        };
    }
}
