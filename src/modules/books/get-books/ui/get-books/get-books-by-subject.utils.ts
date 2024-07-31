import { Book, Subject } from '../../connector-to.get-books';

export const getBooksBySubjectUtils = (booksList: Book[], subject: string) => {
    return booksList.filter((book) => 
        // return book.subject && book.subject.subject && book.subject.subject.toLowerCase().includes(subject.toLowerCase());
        book.subject.find((subjectBook: Subject) => subjectBook.subject.label.toLowerCase().includes(subject.toLowerCase())));
}