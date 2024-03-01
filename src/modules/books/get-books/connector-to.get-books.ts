interface ConnectorToGetBooks {
    getBooks(connectedUser: boolean): Promise<Book[]>;
}

type Book = {
    author: string;
    type: string;
    subject: string;
    dateOfPublication: string;
    image: string;
}
