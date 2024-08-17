'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { BooksModel } from '@/modules/books/model/books.model';
import { CustomCard } from '@/modules/ui/component-level/custom.card';


type Props = {
    book: BooksModel.Book;
}

export const BookCard: FC<Props> = ({ book }) => {
    const router = useRouter();

    const getOneBookAndRedirect = () => {
        router.push(`/catalog/${book.id}`);
    }

    return (
        <CustomCard
            onClick={getOneBookAndRedirect}
            title={book.title}
            description={book.type}
            content={() => (
                <Image
                    className='transform transition-transform duration-300 ease-in-out hover:scale-110 hover:rounded-xl'
                    src={book.image}
                    alt='livre'
                    width={1000}
                    height={1000}
                />
            )}
            footer={() => (
                <>
                    <span className='text-gray-600 text-[0.813rem]'>{book.author.lastname} {book.author.firstname}</span>
                        {book.subjects.map((subject) => (
                            <span key={subject.id} className='text-[0.813rem] font-semibold'>{subject.label}</span>
                        ))}
                    <span className='text-[0.813rem]'>{book.dateOfPublication}</span>
                </>
            )}
        />
    );
}

