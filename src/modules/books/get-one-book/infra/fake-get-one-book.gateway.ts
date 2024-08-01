import { Book } from '@/modules/books/get-one-book/connector-to.get-one-book';

export class FakeGetOneBookGateway {

    returnedResponse!: Book;

    getOneBookByAuthor(authorName: string): Promise<Book> {
        return new Promise((resolve, reject) => {
            if (!authorName) return reject();
            return resolve(this.returnedResponse);
        })
    }

    getOneBookById(id: number): Promise<Book> {
        return new Promise((resolve, reject) => {
            if (!id) return reject();
            return resolve(this.returnedResponse);
        })
    }
}

