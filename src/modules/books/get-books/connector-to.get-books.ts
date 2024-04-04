export interface ConnectorToGetBooks {
    getBooks(connectedUser: boolean): Promise<Book[]>;
}

export type Book = {
    author: string;
    type: string;
    subject: string;
    dateOfPublication: string;
    image: string;
}
