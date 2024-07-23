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
            <Image className={styles['book-image']} src={book.image} alt={'livre'} width={300} height={400}/>
      </div>
      <div className={styles['info-book']}>
        <div>
          <p className={styles['card-title']}>{book.title}</p>
          <p className={styles['card-author']}>
            {book.author.firstname} {book.author.lastname}
          </p>
        </div>
        <p className={styles['card-subject']}>{book.subject.subject}</p>
      </div>
    </div>
  );
};
