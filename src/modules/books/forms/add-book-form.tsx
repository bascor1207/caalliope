import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './add-book-form.module.scss';

interface AddBookFormProps {
    hideModal: () => void;
  }

export const AddBookForm: FC<AddBookFormProps> = ({ hideModal }) => {
    const { t } = useTranslation();
    const {
        formState: { errors }
    } = useForm();

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log('Form data:', formData);
        hideModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <div className={styles.container}>
                <span className={styles.title}>{t('library.addBook')}</span>
                <div className={styles.firstname}>
                    <label>{t('form.ibsn')}</label>
                    <input className={styles['ibsn-input']} type='text' name='ibsn' required />
                    {errors.ibsn && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.date}>
                    <label>{t('form.releaseDate')}</label>
                    <input className={styles['lastname-input']} type='date' name='date' required />
                    {errors.date && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.editor}>
                    <label>{t('form.editor')}</label>
                    <input className={styles['editor-input']} type='text' name='editor' required />
                    {errors.editor && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.translator}>
                    <label>{t('form.translator')}</label>
                    <input className={styles['translator-input']} type='text' name='translator' />
                </div>
                <div className={styles['nb-page']}>
                    <label>{t('form.numberOfPages')}</label>
                    <input className={styles['nb-page-input']} type='number' name='nbPage' required />
                    {errors.nbPage && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.language}>
                    <label>{t('form.language')}</label>
                    <input className={styles['language-input']} type='number' name='language' />
                </div>
                <div className={styles.format}>
                    <label>{t('form.format')}</label>
                    <input className={styles['paper-input']} type='radio' name='paper' checked />
                    <label>{t('form.book')}</label>
                    <input className={styles['ebook-input']} type='radio' name='ebook' />
                    <label>{t('form.ebook')}</label>
                    <input className={styles['audio-input']} type='radio' name='audio' />
                    <label>{t('form.audio')}</label>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.search}>
                        <p>Book cover :</p>
                        <input type='file'
                            id='cover' name='cover'
                            accept='image/png, image/jpeg' />
                    </div>
                    <button className={styles.submit} type='submit'>
                        {t('form.send')}
                    </button>
                </div>
            </div>
        </form>
    );
};