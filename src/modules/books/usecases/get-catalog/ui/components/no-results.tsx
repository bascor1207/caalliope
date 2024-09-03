'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddBookForm } from '@/modules/books/usecases/create-book/ui/forms/add-book-form';
import { CreateBookPage } from '@/modules/books/usecases/create-book/ui/pages/create-book.page';

import styles from './no-results.module.scss';

export const NoResults = () => {
  const { t } = useTranslation();
  const [isShown, setIsShown] = useState(false);

  const toggle = () => {
    setIsShown(!isShown);
  };

  return (
    <div className={styles['no-results']}>
      <p>Pas de résultat pour cette recherche</p>
      <CreateBookPage>
        <AddBookForm onCustomClose={toggle} formType='modal' isShown={isShown}/>
      </CreateBookPage>
        <button className={styles.update} onClick={toggle}>
                {t('addABook')}
        </button>
    </div>
  );
};
