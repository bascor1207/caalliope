import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';


import styles from './publishing-section.module.scss';
import { CustomModal } from '@/modules/ui/component-level/custom.modal';
import { BooksModel } from '@/modules/books/model/books.model';
import { AddPublisherForm } from '@/modules/books/get-books/ui/forms/add-publisher-form';

type Props = {
    book: BooksModel.Book;
}

export const PublishingSection: FC<Props> = ({ book }) => {
    const [isShown, setIsShown] = useState(false);
    const { t } = useTranslation('library');

    const handleClick = () => {
        console.log('option selected')
    };

    const toggle = () => {
        setIsShown(!isShown);
    };

    return (
        <div>
            <div>
                <div className={styles.link} onClick={toggle}>{t('addPublishing')}</div>
                {book.publishers.map((publisher) => (
                    <div key={publisher.id}>
                        <span>{publisher.dateOfPublication} - {publisher.label}
                            | {publisher.language} | {publisher.numberOfPages} pages</span>
                        <div>
                            <select>
                                <option value='notOwned'>{t('notOwned')}</option>
                                <option value='inProgress'>{t('inProgress')}</option>
                                <option value='toRead'>{t('toRead')}</option>
                                <option value='read'>{t('read')}</option>
                                <option value='wishlist'>{t('whislist')}</option>
                                <option value='giveUp'>{t('giveUp')}</option>
                            </select>
                            <button onClick={handleClick}>{t('valid')}</button>
                        </div>
                    </div>
                ))}
                <CustomModal isShown={isShown} hideModal={toggle} modalContent={<AddPublisherForm />} />
            </div>
        </div>
    );
};
