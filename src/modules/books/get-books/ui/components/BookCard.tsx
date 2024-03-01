'use client'
import Image from "next/image";
import { FC } from "react";

import styles from './book-card.module.scss'
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/modules/store/create-store";
import {getOneBookByAuthor} from "@/modules/books/get-one-book/usecase/get-one-book-by-author.usecase";
import {useRouter} from "next/navigation";

type Props = {
    book: Book
}
export const BookCard: FC<Props> = ({ book }) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()

    const getOneBookAndRedirect = () => {
        dispatch(getOneBookByAuthor(book.author)).then(() => router.push('/catalog/book'))
    }
    return (
        <div className={styles.container} onClick={getOneBookAndRedirect}>
            <Image className={styles['book-image']} src={book.image} alt={'livre'} width={300} height={400} />
            <div className={styles['book-author']}>{book.author}</div>
            <div className={styles['book-type']}>{book.type}</div>
            <div  className={styles['book-subject']}>{book.subject}</div>
            <div  className={styles['book-publication-date']}>{book.dateOfPublication}</div>
        </div>
    )
}
