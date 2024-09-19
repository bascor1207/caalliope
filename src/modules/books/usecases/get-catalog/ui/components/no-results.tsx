'use client';
import { Button, Image } from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectLoggedUser } from '@/modules/auth/core/store/auth.selectors';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { AddBookForm } from '@/modules/books/usecases/create-book/ui/forms/add-book-form';
import { CreateBookPage } from '@/modules/books/usecases/create-book/ui/pages/create-book.page';

import styles from './no-results.module.scss';

export const NoResults = () => {
  const { t } = useTranslation();
  const [isShown, setIsShown] = useState(false);
  const isLoggedUser = useAppSelector(selectLoggedUser);
  const dispatch = useDispatch<AppDispatch>();

  const toggle = () => {
    if (!isLoggedUser) {
        dispatch(toggleAuthModal({ type: 'signIn', visible: true }));
        return;
    }
    setIsShown(!isShown);
  };

  return (
    <div className={styles['no-results']}>
      <p>Pas de résultat pour cette recherche</p>
      <CreateBookPage>
        <AddBookForm onCustomClose={toggle} formType='modal' isShown={isShown}/>
      </CreateBookPage>
        <Button
            onPress={toggle}
            startContent={<> {!isLoggedUser && (<Image src='/lock.png' width={18} height={20} alt='locked action'/>)} </>}
        >
                {t('addABook')}
        </Button>
    </div>
  );
};
