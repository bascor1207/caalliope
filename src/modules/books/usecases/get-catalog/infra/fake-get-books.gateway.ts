import type  { BooksModel } from '@/modules/books/model/books.model';
import type { ConnectorToGetBooks } from '@/modules/books/usecases/get-catalog/core/connector-to.get-books';

export class FakeGetBooksGateway implements ConnectorToGetBooks {
    public returnedResponse!: BooksModel.Book[];

    constructor(private delayToResponse: number = 0) {}

    getBooks(): Promise<BooksModel.Book[]> {
        return this.createReturnPayload()
    }

    getBooksBySearch(search: string): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            if (!search) return reject();
            return resolve(this.returnedResponse);
        })
    }

    getBooksByAuthor(value: string): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const searchValue = value.toLowerCase().trim();
                const response = this.returnedResponse.filter((book: BooksModel.Book) => {
                    const authorFirstName = book.author.firstname.toLowerCase();
                    const authorLastName = book.author.lastname.toLowerCase();
                    const authorFullName = `${authorFirstName} ${authorLastName}`;
                    const authorFullNameReversed = `${authorLastName} ${authorFirstName}`;

                    return searchValue.includes(authorFullName) ||
                        searchValue.includes(authorFullNameReversed) ||
                        searchValue.includes(authorFirstName) ||
                        searchValue.includes(authorLastName);
                });
                if (response.length === 0) reject();
                else resolve(response);
            }, this.delayToResponse);
        });
    }

    getBooksByGenre(value: string): Promise<BooksModel.Book[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const response = this.returnedResponse.filter((book: BooksModel.Book) =>
                    book.subjects.some((subjectBook: BooksModel.Subject) =>
                        subjectBook.label.toLowerCase() === value.toLowerCase()
                    )
                );
                if (response.length === 0) resolve([]);
                else resolve(response);
            }, this.delayToResponse);
        });
    }

    getBooksByName(): Promise<BooksModel.Book[]> {
        return this.createReturnPayload()
    }

    private async createReturnPayload(): Promise<BooksModel.Book[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const response = this.returnedResponse;
                if (!response) reject();
                return resolve(response);
            }, this.delayToResponse)
        })
    }
}

