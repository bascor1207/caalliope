import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';

type SearchBarProps = {
  setQuery: (query: string, type: 'name' | 'author') => void;
  query: string;
}
const determineSearchType = (value: string): 'name' | 'author' => {
  return value.includes(' ') ? 'author' : 'name';
};
export const SearchBar = ({ setQuery, query }: SearchBarProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const type = determineSearchType(value);
    setQuery(value, type);
  };

  return (
    <TextField
      id='search-bar'
      className='searchBar'
      label='Name, Author... '
      variant='outlined'
      value={query}
      placeholder='Search...'
      size='small'
      onChange={handleInputChange}
    />
  )
}
