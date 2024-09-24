'use client'
import { Image } from '@nextui-org/react';

import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLocale } from '@/modules/app/core/store/root.selectors';
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
    const locale = useAppSelector(selectLocale);

    const getOneBookAndRedirect = () => {
        window.location.href = `/${locale}/catalog/${book.id}`;
    };

    if (cover) {
        return (
            <CustomCard
                className='max-w-full w-full'
                onClick={getOneBookAndRedirect}
                content={() => (
                    <Image
                        removeWrapper={cover}
                        isZoomed={cover}
                        radius='none'
                        isBlurred={cover}
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
                <div className='flex items-center justify-center w-full h-full mt-4'>
                    <Image
                        removeWrapper
                        isZoomed={cover}
                        radius='none'
                        src={book.image}
                        alt='livre'
                        className='h-full object-cover max-h-[250px]'
                    />
                </div>
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
