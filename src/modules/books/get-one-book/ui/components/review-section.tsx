import { FC, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './publishing-section.module.scss';
import { CustomModal } from '@/modules/ui/component-level/custom.modal';
import { AddReviewForm } from '@/modules/books/get-books/ui/forms/add-review-form';
import { BooksModel } from '@/modules/books/model/books.model';

type Props = {
    book: BooksModel.Book;
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
        {book.reviews?.map((review) => (
          <div key={review.id}>
            <div className={styles['img-top-container']}>
              <Image className={styles.image} src='' alt={'book cover'} width={50} height={50}/>
            </div>
            <h1>{review.userId} {review.userId}</h1>
            <p>{review.comment}</p>
          </div>
        ))}
        <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddReviewForm />} />
      </div>
  );
};
