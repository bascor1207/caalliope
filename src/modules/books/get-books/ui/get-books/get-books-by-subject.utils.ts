import { Book } from "../../connector-to.get-books";

export const getBooksBySubjectUtils = (booksList: Book[], subject: string) => {
    return booksList.filter((book) => 
        book.subject.subject.toLowerCase().includes(subject.toLowerCase()))
}