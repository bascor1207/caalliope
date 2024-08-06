import { FC } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { Book } from '../../connector-to.get-one-book';

import styles from './publishing-section.module.scss';

type Props = {
    book: Book;
}

export const ReviewSection: FC<Props> = ({ book }) => {
  const { t } = useTranslation('library');

    return (
      <div>
        <div className={styles.link}>{t('addReview')}</div>
        {book.reviews.map((review) => (
          <div key={review.review.id}>
            <div className={styles['img-top-container']}>
              <Image className={styles.image} src='' alt={'book cover'} width={50} height={50}/>
            </div>
            <h1>{review.review.userId} {review.review.userId}</h1>
            <p>{review.review.comment}</p>
          </div>
        ))}
      </div>
  );
};