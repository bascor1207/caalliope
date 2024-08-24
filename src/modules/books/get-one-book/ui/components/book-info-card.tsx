import React from 'react';
import { Card, CardHeader, Chip, Image } from '@nextui-org/react';

import { BooksModel } from '@/modules/books/model/books.model';

type Props = {
    book: BooksModel.Book;
}

const generateStars = (rating?: number) => {
  const totalStars = 5;
  const filledStars = rating && Math.floor(rating);
  const halfStar = rating && rating % 1 !== 0;
  const emptyStars = filledStars &&  totalStars - filledStars - (halfStar ? 1 : 0);

  return (
      <>
          {Array(filledStars).fill(<span key={Math.random()}>★</span>)}
          {halfStar && <span key={Math.random()}>☆</span>}
          {Array(emptyStars).fill(<span key={Math.random()}>☆</span>)}
      </>
  );
};

export const BookInfoCard: React.FC<Props> = ({ book }) => {
  return (
    <Card className='bg-transparent text-black'>
      <CardHeader>
        <div className='flex gap-5'>
          <div className='flex gap-5'>
            <Image src={book.image} alt='book cover' className='w-34 h-36 object-cover' />
            <div className='flex flex-col gap-1 items-start justify-center'>
              <h4 className='font-semibold leading-none text-black mb-4'>{book.title} - {book.author.firstname} {book.author.lastname}</h4>
              <div className='flex gap-5 mb-4'>
                {generateStars(book.rating)}
                <span>{book.rating}/5</span>
              </div>
              <p className='mb-4'>
                {book.summary}
              </p>
              <div className='flex gap-5'>
                {book.subjects.map((subject) => {
                  return (
                    <Chip key={subject.id}>{subject.label}</Chip>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
