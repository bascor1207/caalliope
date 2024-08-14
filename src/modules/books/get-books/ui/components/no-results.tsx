import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal } from '@/modal/modal';
import { AddBookForm } from '@/modules/books/forms/add-book-form';

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
      <Modal isShown={isShown} hideModal={toggle} modalContent={<AddBookForm hideModal={toggle} />} />
        <button className={styles.update} onClick={toggle}>
                {t('library.addBook')}
        </button>
    </div>
  );
};
