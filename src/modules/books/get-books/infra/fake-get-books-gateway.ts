export class FakeGetBooksGateway implements GetBooksAdapter {

    constructor(private delayToResponse: number = 0) {}

    public connectedUser!: boolean;
    public returnedResponse!: Book[];

    getBooks(connectedUser: boolean): Promise<Book[]> {
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
}

