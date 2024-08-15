'use client';

import { LayoutGrid } from '@/components/ui/layout-grid';

import { FC } from 'react';

import { BooksModel } from '@/modules/books/model/books.model';

import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';

type Props = {
    books: BooksModel.Book[];
}

export const BooksCatalog: FC<Props> = ({ books }) => {
    const booksCards = books.map((book) => createCards(book))

    return (
        <div className='h-[700px] w-full'>
            <LayoutGrid cards={booksCards}/>
        </div>
    );
}

const createCards = (book: BooksModel.Book) => (
    {
        id: book.id,
        content: <BookCard book={book}/>,
        className: 'h-full',
        thumbnail: book.image
    }
)
