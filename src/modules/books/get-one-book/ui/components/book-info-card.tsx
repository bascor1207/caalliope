import React from 'react';
import Image from 'next/image';

import { Book } from '../../connector-to.get-one-book';

import styles from './book-info-card-catalog.module.scss';

type Props = {
    book: Book;
}

const generateStars = (rating: number) => {
  const totalStars = 5;
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

  return (
      <>
          {Array(filledStars).fill(<span key={Math.random()}>★</span>)}
          {halfStar && <span key={Math.random()}>☆</span>}
          {Array(emptyStars).fill(<span key={Math.random()}>☆</span>)}
      </>
  );
};

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
          {generateStars(book.rating)}
          <span>{book.rating}/5</span>
        </div>
        <p>
          {book.summary}
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