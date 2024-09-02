
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';

import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';

export class FakeCreateBookGateway implements ConnectorToCreateBookGateway {
    bookToCreate: BooksModel.AddBookFormSchemaType | undefined;
    resolvedValue!: BooksModel.BookCreation;
    rejectedValue!: BooksModel.BookCreation;

    constructor() {
        this.setup()
    }

    async create(): Promise<BooksModel.BookCreation> {
        return new Promise((resolve) => {
            if (!this.bookToCreate) {
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
