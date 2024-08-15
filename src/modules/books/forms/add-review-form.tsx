
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './add-book-form.module.scss';

interface AddReviewForm {
    hideModal: () => void;
  }

export const AddReviewForm: FC<AddReviewForm> = ({ hideModal }) => {
    const { t } = useTranslation();
    const {
        formState: { errors }
    } = useForm();

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        alert('Votre revew a été enregistrée.');
        console.log('Form data:', formData);
        hideModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <div className={styles.container}>
                <span className={styles.title}>{t('library.addReview')}</span>
                <div className={styles.isbn}>
                    <label>{t('library.yourReview')} </label>
                    <input className={styles.input} type='text' name='review' required />
                    {errors.ibsn && <span>{t('required')}</span>}
                </div>
                <div className={styles.buttons}>
                    <button className={styles.submit} type='submit'>
                        {t('valid')}
                    </button>
                </div>
            </div>
        </form>
    );
};