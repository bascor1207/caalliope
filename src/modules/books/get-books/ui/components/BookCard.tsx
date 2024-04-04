'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '@/modules/store/create-store';
import { Book } from '@/modules/books/get-books/connector-to.get-books';
import { getOneBookByAuthor } from '@/modules/books/get-one-book/usecase/get-one-book-by-author.usecase';

import styles from './book-card.module.scss'

type Props = {
    book: Book;
    slideSize?: number;
}

const RATIO = 4 / 3;
const defaultSize = 150;

export const BookCard: FC<Props> = ({ book, slideSize }) => {
    const [size, setSize] = useState(defaultSize);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()

    useEffect(() => {
        setSize((previousSize) => slideSize && !Number.isNaN(slideSize) ? slideSize : previousSize)
    }, [slideSize]);

    console.log(size, slideSize);

    const getOneBookAndRedirect = () => {
        dispatch(getOneBookByAuthor(book.author)).then(() => router.push('/catalog/book'))
    }
    return (
        <section className={styles.container} onClick={getOneBookAndRedirect}>
            <div key={book.author + book.dateOfPublication} className={styles.subcontainer}>
                <div className={styles.container}>
                    <div className={styles['img-top-container']} style={{ height: size * RATIO }}>
                        <Image className={styles['book-image']} src={book.image} alt={'livre'} width={300} height={400}/>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.title}>{ book.author }</div>
                        <div className={styles.text}>{ book.subject }</div>
                        <div className={styles['book-subject']}>{ book.subject }</div>
                        <div className={styles['book-publication-date']}>{ book.dateOfPublication }</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
