import TextField from '@mui/material/TextField';

import styles from './search-bar.module.scss';

type SearchBarProps = {
  setQuery: (query: string) => void;
  query: string;
}
export const SearchBar = ({ setQuery, query }: SearchBarProps) => {

  return (
    <TextField
      id='search-bar'
      className={styles.searchBar}
      label='Name, Author... '
      variant='outlined'
      value={query}
      placeholder='Search...'
      size='small'
      onChange={(e) => setQuery(e.currentTarget.value)}
    />
  )
}
