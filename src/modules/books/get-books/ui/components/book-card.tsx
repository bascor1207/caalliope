'use client'
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Image } from '@nextui-org/react';
import { BooksModel } from '@/modules/books/model/books.model';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';


type Props = {
    book: BooksModel.Book;
    cover?: boolean;
}

export const BookCard: FC<Props> = ({ book, cover = false }) => {
    const router = useRouter();

    const getOneBookAndRedirect = () => {
        router.push(`/catalog/${book.id}`);
    }

    return (
        <CustomCard
            className='max-w-full'
            onClick={getOneBookAndRedirect}
            title={book.title}
            description={book.type}
            content={() => (
                <Image
                    isZoomed={cover}
                    radius='none'
                    src={book.image}
                    alt='livre'
                    className='h-full'
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
            cover={cover}
        />
    );
}

