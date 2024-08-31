import { BooksModel } from '@/modules/books/model/books.model';

export class BookFactory {
    static create(data?: Partial<BooksModel.Book>): BooksModel.Book {
        return {
            id: 1,
            title: 'title novel',
            author: {
              id: 1,
              lastname: 'Doe',
              firstname: 'John',
              image: '',
              email: '',
              birthDate: ''
            },
            type: 'Fiction',
            subjects: [
              {
                id: 1,
                label: 'mystery'
              }
            ],
            image: '/livre1.jpg',
            dateOfPublication: '2022-03-15',
            publishers: [
              {
                id: 1,
                label: 'Publisher Name',
                language: 'English',
                numberOfPages: 320,
                dateOfPublication: '2022-03-15'
              }
            ],
            rating: 4.5,
            summary: 'This is a summary of the novel.',
            reviews: [
              {
                id: 1,
                user: {
                  id: '101',
                  username: 'john_doe',
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john.doe@example.com',
                  avatar: {
                    id: 1,
                    url: '/avatars/john_doe.jpg',
                  },
                  myBooksToRead: [],
                  myInProgressBooks: [],
                  myAlreadyReadBooks: [],
                  myAbandonedBooks: [],
                  myWishlist: []
                },
                comment: 'Great book!',
                date: '2022-03-20'
              }
            ],
            ...data
        }
    }
}
