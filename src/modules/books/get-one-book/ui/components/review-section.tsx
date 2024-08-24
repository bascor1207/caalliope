import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Card, CardBody, CardHeader } from '@nextui-org/react';

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
        {book.reviews?.map((review) => (
        <Card className='max-w-[340px]' key={review.id}>
          <CardHeader className='justify-between'>
            <div className='flex gap-5'>
              <Avatar isBordered radius='full' size='md' src='https://nextui.org/avatars/avatar-1.png' />
              <div className='flex flex-col gap-1 items-start justify-center'>
                <h4 className='text-small font-semibold leading-none text-default-600'>{review.comment}</h4>
              </div>
            </div>
            <Button onClick={toggle}>
              {t('addReview')}
            </Button>
          </CardHeader>
          <CardBody className='px-3 py-0 text-small text-default-400'>
            <p>
              {review.comment}
            </p>
          </CardBody>
          </Card>
        ))}
        {/* <Button onClick={toggle}>
          {t('addReview')}
        </Button>
        {book.reviews?.map((review) => (
          <CustomCard
            key={review.id}
            title='utilisateur'
            content={() => (review.comment)}
            cover={false} />
        ))} */}
        {/* <div className={styles.link} onClick={toggle}>{t('addReview')}</div>
        {book.reviews?.map((review) => (
          <div key={review.id}>
            <div className={styles['img-top-container']}>
              <Image className={styles.image} src='' alt={'book cover'} width={50} height={50}/>
            </div>
            <h1>{review.userId} {review.userId}</h1>
            <p>{review.comment}</p>
          </div>
        ))} */}
        <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddReviewForm />} />
      </div>
  );
};
