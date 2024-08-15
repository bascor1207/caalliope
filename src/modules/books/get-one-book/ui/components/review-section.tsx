import { FC, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/modal/modal';
import { Book } from '../../connector-to.get-one-book';
import { AddReviewForm } from '@/modules/books/forms/add-review-form';

import styles from './publishing-section.module.scss';

type Props = {
    book: Book;
}

export const ReviewSection: FC<Props> = ({ book }) => {
  const [isShown, setIsShown] = useState(false);
  const { t } = useTranslation('library');

  const toggle = () => {
    setIsShown(!isShown);
  };

    return (
      <div>
        <div className={styles.link} onClick={toggle}>{t('addReview')}</div>
        {book.reviews.map((review) => (
          <div key={review.review.id}>
            <div className={styles['img-top-container']}>
              <Image className={styles.image} src='' alt={'book cover'} width={50} height={50}/>
            </div>
            <h1>{review.review.userId} {review.review.userId}</h1>
            <p>{review.review.comment}</p>
          </div>
        ))}
        <Modal isShown={isShown} hideModal={toggle} modalContent={<AddReviewForm hideModal={toggle} />} />
      </div>
  );
};