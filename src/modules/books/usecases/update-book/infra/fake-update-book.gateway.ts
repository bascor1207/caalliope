import type  { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToUpdateBookGateway } from '@/modules/books/usecases/update-book/core/connector-to-update-book.gateway';


import { CustomErrorWrapper } from '@/modules/app/core/error-wrapper';
import { BookFactory } from '@/modules/books/model/books.factory';


export class FakeUpdateBookGateway implements ConnectorToUpdateBookGateway {
    books!: BooksModel.Book[];
    bookToUpdate!: BooksModel.Book | undefined;
    resolvedValue!: BooksModel.InformUser;
    rejectedValue!: BooksModel.InformUser;

    constructor() {
        this.setup()
    }

    async updateBook(payload: BooksModel.EditBookForm): Promise<BooksModel.InformUser | undefined> {
        return new Promise((resolve) => {
            if (Object.keys(payload).length < 1) {
                CustomErrorWrapper.throwError(this.rejectedValue)
            }
            if (!this.bookToUpdate) {
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
            message: 'There was an error trying update the book, please retry later',
            type: 'error'
        };
        this.books = [BookFactory.create(), BookFactory.create({ id: 2 })]
    }

    updateBookRating(): Promise<BooksModel.InformUser & {bookId: number} | void> {
        return new Promise((resolve) => {
            resolve();
        });
    }
}
