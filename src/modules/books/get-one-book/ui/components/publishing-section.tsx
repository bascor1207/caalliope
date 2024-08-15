import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/modal/modal';
import { Book } from '../../connector-to.get-one-book';
import { AddPublishingForm } from '@/modules/books/forms/add-publishing-form';

import styles from './publishing-section.module.scss';

type Props = {
    book: Book;
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
                {book.publishing.map((publishing) => (
                    <div key={publishing.publishingHouse.id}>
                        <span>{publishing.publishingHouse.dateofPublication} - {publishing.publishingHouse.label}
                            | {publishing.publishingHouse.language} | {publishing.publishingHouse.numberOfPages} pages</span>
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
                <Modal isShown={isShown} hideModal={toggle} modalContent={<AddPublishingForm hideModal={toggle} />} />
            </div>
        </div>
    );
};