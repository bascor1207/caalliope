import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Book } from '../../connector-to.get-one-book';

import styles from './publishing-section.module.scss';

type Props = {
    book: Book;
}

export const PublishingSection: FC<Props> = ({ book }) => {
    const { t } = useTranslation('library');
    
    const handleClick = () => {
        console.log('option selected')
    };
    
    return (
        <div>
            <div>
                <div className={styles.link}>{t('addPublishing')}</div>
                {book.publishing.map((publishing) => (
                    <div key={publishing.publishingHouse.id}>
                        <span>{publishing.publishingHouse.dateofPublication} - {publishing.publishingHouse.label}
                            | {publishing.publishingHouse.language} | {publishing.publishingHouse.numberOfPages} pages</span>
                        <div>
                            <select>
                                <option value='notOwned'>{t('notOwned')}</option>
                                <option value='inProgress'>{t('inProgress')}</option>
                                <option value='toRead'>{t('toRead')}</option>
                                <option value='wishlist'>{t('whislist')}</option>
                                <option value='giveUp'>{t('giveUp')}</option>
                            </select>
                            <button onClick={handleClick}>{t('valid')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};