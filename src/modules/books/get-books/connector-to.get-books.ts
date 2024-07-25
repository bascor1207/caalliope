export interface ConnectorToGetBooks {
    getPopularBooks(): Promise<Book[]>;
    getLastReleaseBooks(): Promise<Book[]>;
    getBooksBySearch(search: string): Promise<Book[]>;
    getBooks(/*connectedUser: boolean*/): Promise<Book[]>;
}

export type Book = {
    id: number;
    title: string;
    author: Author;
    type: string;
    subject: Subject;
    dateOfPublication: string;
    image: string;
}

export type Author = {
    id: number;
    lastname: string;
    firstname: string;
    image: string;
    email: string;
    birthDate: string;
}

export type Subject = {
    id: number;
    subject: string;
}