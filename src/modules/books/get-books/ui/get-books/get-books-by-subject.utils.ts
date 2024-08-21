import { BooksModel } from '@/modules/books/model/books.model';

export const getBooksBySubjectUtils = (booksList: BooksModel.Book[], subject: string) => {
    return booksList.filter((book) =>
        book.subjects.find((subjectBook: BooksModel.Subject) => subjectBook.label.toLowerCase().includes(subject.toLowerCase())));
}
