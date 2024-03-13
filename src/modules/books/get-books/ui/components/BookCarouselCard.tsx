import Image from "next/image";
import { Book } from "@/modules/books/get-books/connector-to.get-books";

import styles from "./book-carousel-card.module.scss";

type Props = {
    book: Book;
}

export const BookCarouselCard: React.FC<Props> = ({ book }: Props) => {
    return (
        <div>
            <div key={book.id}>
                <Image className={styles['book-image']} src={book.image} alt={'livre'} width={100} height={200} />
                <p>{ book.title }</p>
            </div>
        </div>
      );
}