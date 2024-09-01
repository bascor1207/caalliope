import { ConnectorToCreateBookGateway } from '@/modules/books/usecases/create-book/core/connector-to-create-book.gateway';
import { BooksModel } from '@/modules/books/model/books.model';

export class FakeCreateBookGateway implements ConnectorToCreateBookGateway {
    bookToCreate: BooksModel.AddBookFormSchemaType | undefined;
    resolvedValue!: BooksModel.BookCreation;
    rejectedValue!: BooksModel.BookCreation;

    async create(): Promise<BooksModel.BookCreation> {
        console.log(this.bookToCreate)
        return new Promise((resolve, reject) => {
            if (!this.bookToCreate) {
               throw new CustomErrorWrapper(this.rejectedValue)
            }
            resolve(this.resolvedValue)
        })
    }
}


class CustomErrorWrapper extends Error {
    public payload: any;

    constructor(payload?: any) {
        super('');
        this.name = this.constructor.name;
        this.payload = payload;
        Error.captureStackTrace(this, this.constructor);
    }
}
