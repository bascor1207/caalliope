import {ConnectorToGetOneBook} from "@/modules/books/get-one-book/connector-to.get-one-book";

export class FakeGetOneBookGateway implements ConnectorToGetOneBook {

    returnedResponse!: Book;

    getOneBookByAuthor(authorName: string): Promise<Book> {
        return new Promise((resolve, reject) => {
            if (!authorName) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

export type Book = {
    id: string;
    author: string;
    title: string;
}
