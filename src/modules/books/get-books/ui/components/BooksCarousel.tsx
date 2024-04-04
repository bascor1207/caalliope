import CarouselContainer from '@/modules/ui/component-level/carousel/CarouselContainer';
import CarouselSlides, { CarouselSlidesProps } from '@/modules/ui/component-level/carousel/CarouselSlides';
import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';
import { Book } from '@/modules/books/get-books/connector-to.get-books';


type BooksCarouselProps = {
    withGap?: boolean;
    withExtraGap?: boolean;
    slides: Book[];
    title?: string;
}

export const BooksCarousel = (
    { withGap = false, withExtraGap = false, slides, title = '' }: BooksCarouselProps
) =>{
    return (
        <CarouselContainer title={title} withGap={withGap} withExtraGap={withExtraGap} renderComponent={
            (props: CarouselSlidesProps) => (
                <CarouselSlides {...props}>
                    { slides.map((slide, i) => {
                        return (
                            <BookCard key={i} book={slide} slideSize={props.state.childrenWidth} />
                        );
                    }) }
                </CarouselSlides>
            )}
        />
    );
};

export default BooksCarousel;
