'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/modules/store/create-store';
import { Book } from '@/modules/books/get-books/connector-to.get-books';
import { getOneBookById } from '@/modules/books/get-one-book/usecase/get-one-book-by-id.usecase';

type Props = {
    book: Book;
    slideSize?: number;
}

const RATIO = 4 / 3;
const defaultSize = 150;

export const BookCard: FC<Props> = ({ book, slideSize }) => {
    const [size, setSize] = useState(defaultSize);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        setSize((previousSize) => slideSize && !Number.isNaN(slideSize) ? slideSize : previousSize)
    }, [slideSize]);

    console.log(size, slideSize);

    const getOneBookAndRedirect = (bookId: number) => {
        console.log(bookId);
        dispatch(getOneBookById(book.id)).then(() => router.push(`/catalog/${bookId}`))
    }

    return (
        <section className='w-full cursor-pointer'>
            <div className='text-4xl text-black'>{book.author.lastname} {book.author.firstname}</div>
            <div key={book.author + book.dateOfPublication} className='flex flex-col w-full'>
                <div className='w-full'>
                    <div className='flex justify-center items-center my-auto py-14' style={{ height: size * RATIO }}>
                        <Image
                            className='transform transition-transform duration-300 ease-in-out hover:scale-120'
                            src={book.image}
                            alt='livre'
                            width={300}
                            height={400}
                        />
                    </div>
                    <div className='flex flex-col gap-2 bg-white pt-4 min-h-[124px]'>
                        <div className='text-gray-600 text-[0.813rem]'>{book.author.lastname} {book.author.firstname}</div>
                        <div className='text-black text-[0.813rem] font-semibold'>{book.subject.subject}</div>
                        <div className='text-black text-[0.813rem] font-semibold'>{book.subject.subject}</div>
                        <div className='text-black text-[0.813rem]'>{book.dateOfPublication}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
