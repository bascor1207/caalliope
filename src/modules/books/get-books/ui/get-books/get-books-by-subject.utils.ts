import { Book, Subject } from '../../connector-to.get-books';

export const getBooksBySubjectUtils = (booksList: Book[], subject: string) => {
    return booksList.filter((book) =>
        book.subjects.find((subjectBook: Subject) => subjectBook.label.toLowerCase().includes(subject.toLowerCase())));
}
