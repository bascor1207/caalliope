import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, SelectItem, Card, CardBody } from '@nextui-org/react';

import styles from './publishing-section.module.scss';
import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';
import { BooksModel } from '@/modules/books/model/books.model';
import { AddPublisherForm } from '@/modules/books/get-books/ui/forms/add-publisher-form';

type Props = {
    book: BooksModel.Book;
}

export const PublishingSection: FC<Props> = ({ book }) => {
    const [isShown, setIsShown] = useState(false);
    const { t } = useTranslation('');

    const handleClick = () => {
        console.log('option selected')
    };

    const toggle = () => {
        setIsShown(!isShown);
    };

    return (
        <div>
            <div className='flex items-start justify-between mb-4'>
                {book.publishers.map((publisher) => (
                    <Card key={publisher.id} className='bg-transparent text-black max-w-md flex-grow'>
                        <CardBody className='text-black'>
                            <span className='block mb-4'>
                                {publisher.dateOfPublication} - {publisher.label} | {publisher.language} | {publisher.numberOfPages} pages
                            </span>
                            <div className='flex items-center'>
                                <Select placeholder={t('selectOption')} className='text-black bg-white"'>
                                    <SelectItem value='notOwned' key={0}>{t('notOwned')}</SelectItem>
                                    <SelectItem value='inProgress' key={1}>{t('inProgress')}</SelectItem>
                                    <SelectItem value='toRead' key={2}>{t('toRead')}</SelectItem>
                                    <SelectItem value='read' key={3}>{t('read')}</SelectItem>
                                    <SelectItem value='wishlist' key={4}>{t('whislist')}</SelectItem>
                                    <SelectItem value='giveUp' key={5}>{t('giveUp')}</SelectItem>
                                </Select>
                                <Button onClick={handleClick} className='ml-4 bg-[#D9D9D9] hover:bg-[#f8e9ff] text-black'>
                                    {t('valid')}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
                <Button onClick={toggle} className='bg-transparent hover:bg-[#f8e9ff] text-black'>
                    {t('library.addPublishing')}
                </Button>
            </div>
            <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddPublisherForm />} />
        </div>
    );
};
