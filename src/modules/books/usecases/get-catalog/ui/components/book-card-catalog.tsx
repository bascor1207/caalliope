'use client';

import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { BookCard } from '@/modules/books/usecases/get-catalog/ui/components/book-card';


type Props = {
    books: BooksModel.BookForCatalog[];
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
