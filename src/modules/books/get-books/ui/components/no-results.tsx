import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomModal } from '@/modules/ui/component-level/custom.modal';
import { useFormViewmodel } from '@/modules/books/forms/form.viewmodel';

import styles from './no-results.module.scss';
import { AddBookForm, AddBookFormFooter } from '@/modules/books/get-books/ui/forms/add-book-form';

export const NoResults = () => {
  const { t } = useTranslation();
  const [isShown, setIsShown] = useState(false);

  const toggle = () => {
    setIsShown(!isShown);
  };
  const viewmodel = useFormViewmodel({ hideModal: toggle });

  return (
    <div className={styles['no-results']}>
      <p>Pas de résultat pour cette recherche</p>
      <CustomModal
          isShown={isShown} hideModal={toggle} modalContent={<AddBookForm />}
          modalTitle= {t('addABook')} modalDesc={'Informations du livre'} modalFooter={<AddBookFormFooter viewmodel={viewmodel} />}
      />
        <button className={styles.update} onClick={toggle}>
                {t('addABook')}
        </button>
    </div>
  );
};
