// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { CustomModal } from '@/modules/app/ui/component-level/custom.modal';

import styles from './no-results.module.scss';

export const NoResults = () => {
  // const { t } = useTranslation();
  // const [isShown, setIsShown] = useState(false);
  //
  // const toggle = () => {
  //   setIsShown(!isShown);
  // };

  return (
    <div className={styles['no-results']}>
      {/*<p>Pas de résultat pour cette recherche</p>*/}
      {/*<CustomModal*/}
      {/*    isShown={isShown} hideModal={toggle} modalContent={<AddBookForm />}*/}
      {/*    modalTitle= {t('addABook')} modalDesc={'Informations du livre'}*/}
      {/*/>*/}
      {/*  <button className={styles.update} onClick={toggle}>*/}
      {/*          {t('addABook')}*/}
      {/*  </button>*/}
    </div>
  );
};
