import type { ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';
import type { BooksModel } from '@/modules/books/model/books.model';

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

    getPopularBooks(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }

    getLastReleaseBooks(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
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

