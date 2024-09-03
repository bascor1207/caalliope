import type { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToPopularBooks } from '@/modules/books/usecases/get-popular-books/core/connector-to-popular-books.gateway';

export class FakeGetPopularBooksGateway implements ConnectorToPopularBooks{

    constructor(private delayToResponse: number = 0) {}
    public returnedResponse!: BooksModel.Book[];

    getPopularBooks(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }
}

