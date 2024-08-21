import { BooksModel } from '@/modules/books/model/books.model';

export class BookFactory {
    static create(data?: Partial<BooksModel.Book>): BooksModel.Book {
        return {
            id: 1,
            title: 'novel title',
            author: {
                id: 1,
                lastname: 'Medieval',
                firstname: 'Bastien',
                image: 'test',
                email: 'test',
                birthDate: 'test'
            },
            type: 'Novel',
            subjects: [
                {
                    id: 1,
                    label: 'Fantasy Medieval'
                }
            ],
            dateOfPublication: '2023',
            image: 'test',
            publishers: [],
            reviews: [],
            ...data
        }
    }
}
