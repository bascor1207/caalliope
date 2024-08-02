import React from 'react';
import Image from 'next/image';

import { Book } from '../../../get-books/connector-to.get-books';

import styles from './book-info-card-catalog.module.scss';

type Props = {
    book: Book;
}

export const BookInfoCard: React.FC<Props> = ({ book }) => {
    return (
    <div className={styles.container}>
      <div className={styles['img-top-container']}>
            <Image className={styles.image} src={book.image} alt={'book cover'} width={50} height={50}/>
      </div>
      <div className={styles.info}>
        <div>
          <h1 className={styles.title}>{book.title} - {book.author.firstname} {book.author.lastname}</h1>
        </div>
        <div className={styles.rating}>
            <span>★★★★☆</span>
            <span>4.5/5 (984 votes)</span>
        </div>
        <p>
            Une vie dont personne ne se souviendra... Une histoire que vous ne pourrez plus jamais oublier...
        </p>
          <div className={styles.subject}>
            {book.subject.map((subject) => {
              return (
                <div key={subject.subject.id}>{subject.subject.label}</div>
              )
            })}
          </div>
      </div>
    </div>
  );
};