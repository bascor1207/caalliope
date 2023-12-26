import Image from "next/image";
import { FC } from "react";

import styles from './book-card.module.scss'

type Props = {
    book: Book
}
export const BookCard: FC<Props> = ({ book }) => {
    return (
        <div className={styles.container}>
            <Image className={styles['book-image']} src={book.image} alt={'livre'} width={300} height={400} />
            <div className={styles['book-author']}>{book.author}</div>
            <div className={styles['book-type']}>{book.type}</div>
            <div  className={styles['book-subject']}>{book.subject}</div>
            <div  className={styles['book-publication-date']}>{book.dateOfPublication}</div>
        </div>
    )
}
