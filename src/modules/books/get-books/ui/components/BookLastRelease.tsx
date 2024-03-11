import Image from "next/image";
import { Book } from "@/modules/books/get-books/connector-to.get-books";
import { Carousel } from "react-responsive-carousel";

import styles from "./book-last-release.module.scss";

type Props = {
    book: Book;
}

export const BookLastRelease: React.FC<Props> = ({ book }: Props) => {
    return (
        <div>
                {/*books.map(book => (*/
                    <div key={book.id}>
                        <Image className={styles['book-image']} src={book.image} alt={'livre'} width={100} height={200} />
                        <p>{ book.title }</p>
                    </div>
                /*))*/}
        </div>
      );
}