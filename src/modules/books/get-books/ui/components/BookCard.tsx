'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { BooksModel } from '@/modules/books/model/books.model';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    book: BooksModel.Book;
}

export const BookCard: FC<Props> = ({ book }) => {
    const router = useRouter();

    const getOneBookAndRedirect = () => {
        router.push(`/catalog/${book.id}`);
    }

    return (
        <Card onClick={getOneBookAndRedirect} className='text-text-custom-color cursor-pointer bg-custom-purple'>
            <CardHeader>
                <CardTitle >{book.title}</CardTitle>
                <CardDescription>{book.type}</CardDescription>
            </CardHeader>
            <CardContent>
                <Image
                    className='transform transition-transform duration-300 ease-in-out hover:scale-120'
                    src={book.image}
                    alt='livre'
                    width={300}
                    height={400}
                />
            </CardContent>
            <CardFooter className='flex flex-col gap-2 bg-white pt-4 min-h-[124px] rounded-b-xl'>
                <span className='text-gray-600 text-[0.813rem]'>{book.author.lastname} {book.author.firstname}</span>
                {book.subjects.map((subject) => (
                    <span key={subject.id} className='text-[0.813rem] font-semibold'>{subject.label}</span>
                ))}
                <span className='text-[0.813rem]'>{book.dateOfPublication}</span>
            </CardFooter>
        </Card>
    );
}

