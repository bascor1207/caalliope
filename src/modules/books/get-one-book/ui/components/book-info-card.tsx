import {
 Card, CardHeader, Chip, Image
} from '@nextui-org/react';
import React from 'react';

import type { BooksModel } from '@/modules/books/model/books.model';

type Props = {
    book: BooksModel.Book;
}

const generateStars = (rating?: number) => {
  const totalStars = 5;
  const filledStars = rating && Math.floor(rating) || 0;
  const halfStar = rating && rating % 1 !== 0;
  const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

  return (
      <>
          {Array.from({ length: filledStars }, (_, index) => (
              <span key={`filled-${index}`}>★</span>
          ))}
          {halfStar && <span key='half'>☆</span>}
          {Array.from({ length: emptyStars }, (_, index) => (
              <span key={`empty-${index}`}>☆</span>
          ))}
      </>
  );
};

export const BookInfoCard: React.FC<Props> = ({ book }) => {
  console.log(book)
  return (
    <Card className='bg-transparent text-black'>
      <CardHeader>
        <div className='flex gap-5'>
          <div className='flex gap-5'>
            <Image src={book.image} alt='book cover' className='w-45 h-40 object-cover' />
            <div className='flex flex-col gap-1 items-start justify-center'>
              <h4 className='font-bold leading-none text-black mb-4 uppercase text-xl'>{book.title} - {book.author.firstname} {book.author.lastname}</h4>
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
