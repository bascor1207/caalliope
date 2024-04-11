import TextField from '@mui/material/TextField';

type SearchBarProps = {
  setQuery: (query: string) => void;
  query: string;
}
export const SearchBar = ({ setQuery, query }: SearchBarProps) => {

  return (
    <TextField
      id='search-bar'
      className='text'
      label='Nom, EAN... '
      variant='outlined'
      value={query}
      placeholder='Search...'
      size='small'
      onChange={(e) => setQuery(e.currentTarget.value)}
    />
  )
}
