'use client';

import { FC } from 'react';

import { BooksModel } from '@/modules/books/model/books.model';

import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';

type Props = {
    books: BooksModel.Book[];
}

export const BooksCatalog: FC<Props> = ({ books }) => {

    return (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {books.map((book) => (
                <div key={book.id}>
                    <BookCard book={book} cover/>
                </div>
            ))}
        </div>
    );
}
