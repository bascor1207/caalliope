export interface ConnectorToGetBooks {
    getBooks(connectedUser: boolean): Promise<Book[]>;
    getBooksLastRelease(): Promise<Book[]>;
}

export type Book = {
    title: string;
    author: string;
    type: string;
    subject: string;
    dateOfPublication: string;
    image: string;
}
