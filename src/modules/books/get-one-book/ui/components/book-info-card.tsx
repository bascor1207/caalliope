import { Chip, Image } from '@nextui-org/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { updateBookRating } from '@/modules/books/get-one-book/core/get-book.slice';
import { informUser } from '@/modules/user/core/store/user.slice';

type Props = {
    book: BooksModel.Book;
}

const useGenerateStars = (rating?: number) => {
    const totalStars = 5;
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const displayedStars = hoveredStar !== null ? hoveredStar + 1 : rating || 0;

    const handleStarClick = (index: number) => {
        dispatch(updateBookRating({ rating : index + 1 }));
        dispatch(informUser({
            type: 'success',
            message: `Merci pour votre avis ! ${index + 1} étoiles sur 5`,
            status: 'displayed'
        }));
    };

    return (
        <>
            {Array.from({ length: displayedStars }, (_, index) => (
                <span
                    key={`filled-${index}`}
                    onMouseEnter={() => setHoveredStar(index)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => handleStarClick(index)}
                >
                    ★
                </span>
            ))}
            {Array.from({ length: totalStars - displayedStars }, (_, index) => (
                <span
                    key={`empty-${index}`}
                    onMouseEnter={() => setHoveredStar(displayedStars + index)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => handleStarClick(displayedStars + index)}
                >
                    ☆
                </span>
            ))}
        </>
    );
};

export const BookInfoCard: React.FC<Props> = ({ book }) => {
    const stars = useGenerateStars(book.rating);
    return (
          <CustomCard
              isPressable={false}
              title={`${book.title} - ${book.author.firstname} ${book.author.lastname}`}
              content={() => (
                      <div className='mb-4 grid grid-cols-[auto_1fr] gap-5'>
                          <div>
                              <Image
                                  src={book.image}
                                  alt='book cover'
                                  className='w-full h-auto max-w-[400px] max-h-[600px] object-cover'
                                  loading='eager'
                                  removeWrapper
                                  width={400} height={600}
                              />
                          </div>

                      <div className='flex flex-col gap-4 justify-center'>
                          {/* Note et étoiles */}
                          <div className='flex items-center gap-2'>
                              {stars}
                              <span>{book.rating}/5</span>
                          </div>

                          <p className='text-sm mb-4'>
                              {book.summary}
                          </p>

                          <div className='flex gap-2 flex-wrap'>
                              {book.subjects.map((subject) => (
                                  <Chip className='text-custom-dark-purple bg-white' variant='shadow' radius='lg' key={subject.id}>{subject.label}</Chip>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
              className='text-black'
          />
  );
};
