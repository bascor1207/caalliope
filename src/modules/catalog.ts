import { BooksModel } from '@/modules/books/model/books.model';

export const catalog = [
  {
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
        userId: 101,
        comment: 'Great book!',
        date: '2022-03-20'
      }
    ]
  },
  {
    id: 2,
    title: 'title novel',
    author: {
      id: 2,
      lastname: 'Smith',
      firstname: 'Jane',
      image: '',
      email: '',
      birthDate: ''
    },
    type: 'Non-Fiction',
    subjects: [
      {
        id: 2,
        label: 'science'
      }
    ],
    image: '/livre1.jpg',
    dateOfPublication: '2021-07-10',
    publishers: [
      {
        id: 2,
        label: 'Publisher Name',
        language: 'English',
        numberOfPages: 220,
        dateOfPublication: '2021-07-10'
      }
    ],
    rating: 4.2,
    summary: 'This is a summary of the non-fiction book.',
    reviews: [
      {
        id: 2,
        userId: 102,
        comment: 'Informative and well-written.',
        date: '2021-07-15'
      }
    ]
  },
  {
    id: 3,
    title: 'Another Fiction Novel',
    author: {
      id: 3,
      lastname: 'Brown',
      firstname: 'Charlie',
      image: '',
      email: '',
      birthDate: ''
    },
    type: 'Fiction',
    subjects: [
      {
        id: 3,
        label: 'adventure'
      }
    ],
    image: '/livre1.jpg',
    dateOfPublication: '2020-11-25',
    publishers: [
      {
        id: 3,
        label: 'Adventure Press',
        language: 'English',
        numberOfPages: 280,
        dateOfPublication: '2020-11-25'
      }
    ],
    rating: 4.7,
    summary: 'An exciting adventure novel full of twists and turns.',
    reviews: [
      {
        id: 3,
        userId: 103,
        comment: 'Could not put it down!',
        date: '2020-12-01'
      }
    ]
  },
  {
    id: 4,
    title: 'Science Explained',
    author: {
      id: 4,
      lastname: 'Johnson',
      firstname: 'Emma',
      image: '',
      email: '',
      birthDate: ''
    },
    type: 'Non-Fiction',
    subjects: [
      {
        id: 4,
        label: 'science'
      }
    ],
    image: '/livre1.jpg',
    dateOfPublication: '2019-05-10',
    publishers: [
      {
        id: 4,
        label: 'Science World',
        language: 'English',
        numberOfPages: 350,
        dateOfPublication: '2019-05-10'
      }
    ],
    rating: 4.0,
    summary: 'A comprehensive guide to understanding complex scientific concepts.',
    reviews: [
      {
        id: 4,
        userId: 104,
        comment: 'Very informative.',
        date: '2019-06-12'
      }
    ]
  },
  {
    id: 5,
    title: 'The Mystery of the Lost Island',
    author: {
      id: 5,
      lastname: 'Williams',
      firstname: 'Olivia',
      image: '',
      email: '',
      birthDate: ''
    },
    type: 'Fiction',
    subjects: [
      {
        id: 5,
        label: 'mystery'
      }
    ],
    image: '/livre1.jpg',
    dateOfPublication: '2018-08-22',
    publishers: [
      {
        id: 5,
        label: 'Mystery House',
        language: 'English',
        numberOfPages: 310,
        dateOfPublication: '2018-08-22'
      }
    ],
    rating: 4.8,
    summary: 'A gripping mystery set on a deserted island.',
    reviews: [
      {
        id: 5,
        userId: 105,
        comment: 'A thrilling read!',
        date: '2018-09-01'
      }
    ]
  },
  {
    id: 6,
    title: 'History of the World',
    author: {
      id: 6,
      lastname: 'Lee',
      firstname: 'Sophia',
      image: '',
      email: '',
      birthDate: ''
    },
    type: 'Non-Fiction',
    subjects: [
      {
        id: 6,
        label: 'history'
      }
    ],
    image: '/livre1.jpg',
    dateOfPublication: '2017-03-30',
    publishers: [
      {
        id: 6,
        label: 'History Books',
        language: 'English',
        numberOfPages: 450,
        dateOfPublication: '2017-03-30'
      }
    ],
    rating: 4.3,
    summary: 'An in-depth look at the history of the world from ancient times to modern day.',
    reviews: [
      {
        id: 6,
        userId: 106,
        comment: 'A bit long, but very detailed.',
        date: '2017-04-15'
      }
    ]
  }
] satisfies BooksModel.Book[];
