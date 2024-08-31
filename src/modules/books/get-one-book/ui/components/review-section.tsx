import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Card, CardBody, CardHeader } from '@nextui-org/react';

import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { AddReviewForm } from '@/modules/books/get-books/ui/forms/add-review-form';
import { BooksModel } from '@/modules/books/model/books.model';

type Props = {
    book: BooksModel.Book;
}

export const ReviewSection: FC<Props> = ({ book }) => {
  const [isShown, setIsShown] = useState(false);
  const { t } = useTranslation();

  const toggle = () => {
    setIsShown(!isShown);
  };

    return (
      <div>
        <div className='flex items-start justify-between mb-4'>
          {book.reviews?.map((review) => (
            <Card className='max-w-[340px] mt-2 bg-transparent text-black max-w-md flex-grow' key={review.id}>
              <CardHeader className='justify-between'>
                <div className='flex gap-5'>
                  <Avatar isBordered radius='full' size='md' src={review.user?.avatar.url}/>
                  <div className='flex flex-col gap-1 items-start justify-center'>
                    <h4 className='font-semibold leading-none text-black'>{review.user?.username}</h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody className='px-3 py-0 text-black'>
                <p className='mb-4'>
                  {review.comment}
                </p>
              </CardBody>
            </Card>
          ))}
          <Button onClick={toggle} className='bg-transparent hover:bg-[#f8e9ff] text-black mb-4 underline'>
            {t('library.addReview')}
          </Button>
        </div>
        <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddReviewForm />} />
      </div>
  );
};
