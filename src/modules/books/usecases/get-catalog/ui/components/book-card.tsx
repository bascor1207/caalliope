'use client'
import { Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { CustomCard } from '@/modules/app/ui/component-level/custom.card';

type Props = {
    book: BooksModel.Book;
    cover?: false;
};

type PropsForCatalog = {
    book: BooksModel.BookForCatalog;
    cover: true;
};

type BookCardProps = Props | PropsForCatalog;

export const BookCard: FC<BookCardProps> = ({ book, cover }) => {
    const router = useRouter();

    const getOneBookAndRedirect = () => {
        router.push(`/catalog/${book.id}`);
    };

    if (cover) {
        return (
            <CustomCard
                className='max-w-full'
                onClick={getOneBookAndRedirect}
                content={() => (
                    <Image
                        removeWrapper={cover}
                        isZoomed={cover}
                        radius='none'
                        src={book.image}
                        alt='livre'
                        className='w-full h-full object-cover'
                    />
                )}
                cover={cover}
            />
        );
    }

    return (
        <CustomCard
            className='max-w-full'
            onClick={getOneBookAndRedirect}
            title={book.title}
            description={book.type}
            content={() => (
                <Image
                    removeWrapper={cover}
                    isZoomed={cover}
                    radius='none'
                    src={book.image} // Utilise la bonne propriété selon `cover`
                    alt='livre'
                    className='w-full h-full object-cover'
                />
            )}
            footer={() => (
                <>
          <span className='text-gray-600 text-[0.813rem]'>
            {book.author.lastname} {book.author.firstname}
          </span>
                    {book.subjects.map((subject) => (
                        <span key={subject.id} className='text-[0.813rem] font-semibold'>
              {subject.label}
            </span>
                    ))}
                    <span className='text-[0.813rem]'>{book.dateOfPublication}</span>
                </>
            )}
            cover={cover}
        />
    );
};
