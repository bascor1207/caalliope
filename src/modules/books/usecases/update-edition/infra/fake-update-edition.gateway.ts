import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToUpdateEditionGateway } from '@/modules/books/usecases/update-edition/core/connector-to-update-edition.gateway';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { BookFactory } from '@/modules/books/model/books.factory';

export class FakeUpdateEditionGateway implements ConnectorToUpdateEditionGateway {
    books!: BooksModel.Book[];
    editionToUpdate!: BooksModel.Book | undefined;
    resolvedValue!: BooksModel.InformUser;
    rejectedValue!: BooksModel.InformUser;

    constructor() {
        this.setup()
    }

    async updateEdition(payload: BooksModel.EditBookForm): Promise<BooksModel.InformUser | undefined> {
        return new Promise((resolve) => {
            if (Object.keys(payload).length < 1) {
                CustomErrorWrapper.throwError(this.rejectedValue)
            }
            if (!this.editionToUpdate) {
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
            message: 'There was an error trying update the edition, please retry later',
            type: 'error'
        };
        this.books = [BookFactory.create(), BookFactory.create({ id: 2 })]
    }
}
