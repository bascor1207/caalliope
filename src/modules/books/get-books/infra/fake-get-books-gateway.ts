import { Book, ConnectorToGetBooks } from '@/modules/books/get-books/connector-to.get-books';

export class FakeGetBooksGateway implements ConnectorToGetBooks {

    constructor(private delayToResponse: number = 0) {}

    public connectedUser!: boolean;
    public returnedResponse!: Book[];

    getBooks(): Promise<Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!this.connectedUser && !response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }

    getBooksLastRelease(): Promise<Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }

    getPopularBooks(): Promise<Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }
}

