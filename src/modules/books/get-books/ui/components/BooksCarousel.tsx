import CarouselContainer from '@/modules/ui/component-level/carousel/CarouselContainer';
import CarouselSlides from '@/modules/ui/component-level/carousel/CarouselSlides';
import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';
import { Book } from '@/modules/books/get-books/connector-to.get-books';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';


type BooksCarouselProps = {
    withGap?: boolean;
    withExtraGap?: boolean;
    slides: Book[];
    title?: string;
}

export const BooksCarousel = (
    { slides, title = '' }: BooksCarouselProps
) => {
    return (
        <Carousel>
            <p>{title}</p>
            <CarouselContent>
            {slides.map((slide) => (
                <CarouselItem key={slide.id} className='md:basis-1/2 lg:basis-1/5 mr-2'>
                    <BookCard book={slide} />
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className='flex items-center justify-center bg-custom-purple' variant='invert' />
            <CarouselNext className='flex items-center justify-center bg-custom-purple' variant='invert'/>
        </Carousel>
    );
};

export default BooksCarousel;
