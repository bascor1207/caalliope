export interface ConnectorToGetOneBook {
    getOneBookByAuthor(authorName: string): Promise<Partial<Book>>;
    getOneBookById(id: number): Promise<Partial<Book>>;
}

export type Book = {
    id: number;
    title: string;
    author: Author;
    summary: string;
    type: string;
    subjects: Subject[];
    publishing: Publishing[];
    reviews: Review[];
    rating: number;
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
        id: number,
        label: string
}

export type Publishing = {
    publishingHouse: {
        id: number,
        label: string,
        language: string,
        numberOfPages: number
        dateofPublication: string
    }
}

export type Review = {
    review: {
        id: number,
        userId: number,
        comment: string,
        date: string
    }
}
