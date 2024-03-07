import Image from "next/image";
import { Book } from "@/modules/books/get-one-book/connector-to.get-one-book";
import { Carousel } from "react-responsive-carousel";

import styles from "./book-last-release.module.scss";

type Props = {
    books: Book[]
}

export const BooksLastRelease: React.FC<Props> = ({ books }: Props) => {
    return (
        <div>
            <Carousel>
                {books.map(book => (
                    <div key={book.id}>
                        <Image className={styles['book-image']} src={book.image} alt={'livre'} width={100} height={200} />
                        <p>{ book.title }</p>
                    </div>
                ))}
            </Carousel>
        </div>
      );
}