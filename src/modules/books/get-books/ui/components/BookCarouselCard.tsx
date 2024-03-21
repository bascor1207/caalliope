import Image from "next/image";
import { Book } from "@/modules/books/get-books/connector-to.get-books";
import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from "./book-carousel-card.module.scss";

type Props = {
    book: Book;
}

export const BookCarouselCard: React.FC<Props> = ({ book }: Props) => {
    return (
        <SwiperSlide key={book.id}>
            <Image className={styles['book-image']} src={book.image} alt={'livre'} width={100} height={200} />
            <p className={styles['book-title']}>{ book.title }</p>
        </SwiperSlide>
      );
}