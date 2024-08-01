import { Book, Subject } from '../../connector-to.get-books';

export const getBooksBySubjectUtils = (booksList: Book[], subject: string) => {
    return booksList.filter((book) => 
        book.subject.find((subjectBook: Subject) => subjectBook.subject.label.toLowerCase().includes(subject.toLowerCase())));
}