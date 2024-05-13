export interface ConnectorToGetBooks {
    getBooks(connectedUser: boolean): Promise<Book[]>;
    getPopularBooks(): Promise<Book[]>;
    getLastReleaseBooks(): Promise<Book[]>;
}

export type Book = {
    id: number;
    title: string;
    author: string;
    type: string;
    subject: string;
    dateOfPublication: string;
    image: string;
}
