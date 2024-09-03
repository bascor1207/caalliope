import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToLastReleaseBooks } from '@/modules/books/usecases/get-last-release-books/core/connector-to-last-release-books';

export class FakeGetLastReleaseBooksGateway implements ConnectorToLastReleaseBooks {

    constructor(private delayToResponse: number = 0) {}
    public returnedResponse!: BooksModel.Book[];

    getLastReleaseBooks(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }
}

