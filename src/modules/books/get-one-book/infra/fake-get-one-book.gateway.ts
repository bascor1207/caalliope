import { ConnectorToGetOneBook } from '@/modules/books/get-one-book/connector-to.get-one-book';
import { BooksModel } from '@/modules/books/model/books.model';

export class FakeGetOneBookGateway implements ConnectorToGetOneBook {

    returnedResponse!: BooksModel.Book;

    getOneBookByAuthor(authorName: string): Promise<BooksModel.Book> {
        return new Promise((resolve, reject) => {
            if (!authorName) return reject();
            return resolve(this.returnedResponse);
        })
    }

    getOneBookById(id: number): Promise<BooksModel.Book> {
        return new Promise((resolve, reject) => {
            if (!id) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

