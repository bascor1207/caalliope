import { ConnectorToGetOneBook } from '@/modules/books/get-one-book/connector-to.get-one-book';

export class FakeGetOneBookGateway implements ConnectorToGetOneBook {

    returnedResponse!: FakeBook;

    getOneBookByAuthor(authorName: string): Promise<FakeBook> {
        return new Promise((resolve, reject) => {
            if (!authorName) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

export type FakeBook = {
    id: string;
    author: string;
    title: string;
}
