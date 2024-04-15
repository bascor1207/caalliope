import { Book } from '../../connector-to.get-books';

export const getBooksBySubjectUtils = (booksList: Book[], subject: string) => {
    return booksList.filter((book) => {
        return book.subject && book.subject.subject.toLowerCase().includes(subject.toLowerCase());
    });
}