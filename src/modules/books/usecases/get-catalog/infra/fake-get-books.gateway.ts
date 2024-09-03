import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

export class FakeGetBooksGateway implements ConnectorToGetBooks {

    constructor(private delayToResponse: number = 0) {}

    public connectedUser!: boolean;
    public returnedResponse!: BooksModel.Book[];

    getBooks(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!this.connectedUser && !response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }

    getBooksBySearch(search: string): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            if (!search) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

