export interface ConnectorToGetOneBook {
    getOneBookByAuthor(authorName: string): Promise<Book>;
}

export type Book = {
    id: string;
    author: string;
    title: string;
}
