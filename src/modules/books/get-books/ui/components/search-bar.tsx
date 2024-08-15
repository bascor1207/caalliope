import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './search-bar.module.scss';

type SearchBarProps = {
  setQuery: (query: string, type: 'name' | 'author') => void;
  query: string;
}
const determineSearchType = (value: string): 'name' | 'author' => {
  return value.includes(' ') ? 'author' : 'name';
};
export const SearchBar = ({ setQuery, query }: SearchBarProps) => {
  const { t } = useTranslation();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const type = determineSearchType(value);
    setQuery(value, type);
  };

  return (
    <div>
      <div className={styles.title}>
        <p>{ t('library.search') }</p>
      </div>
      <TextField
        id='search-bar'
        className={styles.searchBar}
        label='Name, Author... '
        variant='outlined'
        value={query}
        placeholder='Search...'
        size='small'
        onChange={handleInputChange}
      />
    </div>

  )
}
