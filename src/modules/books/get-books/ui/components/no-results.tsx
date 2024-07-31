import React from 'react';
import styles from './no-results.module.scss';

export const NoResults = () => (
  <div className={styles['no-results']}>
    <p>Pas de résultat pour cette recherche</p>
    <button onClick={() => alert('Ajouter le livre')}>Ajouter le livre</button>
  </div>
);