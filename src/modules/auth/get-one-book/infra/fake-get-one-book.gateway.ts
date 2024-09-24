import type { ConnectorToGetOneBook } from '@/modules/books/get-one-book/core/connector-to.get-one-book';
import type { BooksModel } from '@/modules/books/model/books.model';

export class FakeGetOneBookGateway implements ConnectorToGetOneBook {

    returnedResponse!: BooksModel.Book;

    getOneBookById(id: number): Promise<BooksModel.Book> {
        return new Promise((resolve, reject) => {
            if (!id) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

