import React from 'react';

import Image from 'next/image';
import { Book } from '../../connector-to.get-books';

import styles from './book-card-catalog.module.scss';

type Props = {
    book: Book;
}

export const BookCardCatalog: React.FC<Props> = ({ book }) => {
  return (
    <div className={styles.card}>
      <div className={styles['img-top-container']}>
            <Image className={styles.image} src={book.image} alt={'livre'} width={50} height={50}/>
      </div>
      <div className={styles.info}>
        <div>
          <p className={styles.title}>{book.title}</p>
          <p className={styles.author}>
            {book.author.firstname} {book.author.lastname}
          </p>
        </div>
        <p className={styles.subject}>{book.subject.subject}</p>
      </div>
    </div>
  );
};
