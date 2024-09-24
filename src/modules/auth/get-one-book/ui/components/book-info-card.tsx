import { Image } from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';

import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { updateBookRatingUsecase } from '@/modules/books/usecases/update-book/update-book-rating.usecase';

type Props = {
    book: BooksModel.Book;
};

const useGenerateStars = (bookId: number, rating?: number) => {
    const totalStars = 5;
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const displayedStars = hoveredStar !== null ? hoveredStar + 1 : rating || 0;

    const handleStarClick = (index: number) => {
        dispatch(updateBookRatingUsecase({ payload: { rating: index + 1, bookId } }));
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
    const { t } = useTranslation();
    const stars = useGenerateStars(book.id, book.rating);

    const content = () => {
        return (
            <div className={'p-6 space-y-6 flex flex-col xl:flex-row items-center'}>
                <Image
                    removeWrapper
                    src={book.image}
                    alt={t('book.details')}
                    className='object-cover rounded-lg w-full h-full max-h-[250px] max-w-[200px]'
                />

                <div className='mt-4 xl:mt-0 xl:ml-6 flex flex-col'>
                    <h2 className='font-semibold text-xl text-custom-dark-purple'>
                        {book.title} - {book.author.firstname} {book.author.lastname}
                    </h2>

                    <div className='flex items-center gap-2 mt-2'>
                        {stars}
                        <span>{book.rating}/5</span>
                    </div>

                    <p className='text-gray-600 mt-4'>{t('book.summary')}: {book.summary}</p>

                    <div className='flex gap-2 mt-4 flex-wrap'>
                        <span className='font-semibold'>{t('book.subjects')}:</span>
                        {book.subjects.map((subject) => (
                            <span
                                key={subject.id}
                                className='bg-custom-grey text-custom-dark-purple px-2 py-1 rounded-md'
                            >
                {subject.label}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <CustomCard
            title={t('book.details')}
            content={content}
            className='w-full bg-white min-h-full cursor-default'
            isPressable={false}
            divider
        />
    );
};
