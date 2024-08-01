export interface ConnectorToGetOneBook {
    getOneBookByAuthor(authorName: string): Promise<Book>;
    getOneBookById(id: number): Promise<Book>;
}

export type Book = {
    id: number;
    title: string;
    author: Author;
    type: string;
    subject: Subject[];
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
    subject: {
        id: number,
        label: string
    }
}
