import { BookCard } from '@/modules/books/get-books/ui/components/book-card';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { BooksModel } from '@/modules/books/model/books.model';


type BooksCarouselProps = {
    slides: BooksModel.Book[];
    title?: string;
}

export const BooksCarousel = (
    { slides, title = '' }: BooksCarouselProps
) => {
    return (
        <Carousel>
            {title && (
                <p>{title}</p>
            )}
            <CarouselContent>
            {slides.map((slide) => (
                <CarouselItem key={slide.id} className='md:basis-1/2 lg:basis-1/5 mr-2'>
                    <BookCard book={slide} />
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className='flex items-center justify-center'/>
            <CarouselNext className='flex items-center justify-center'/>
        </Carousel>
    );
};

export default BooksCarousel;
