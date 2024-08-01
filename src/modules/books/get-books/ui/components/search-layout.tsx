import { PropsWithChildren } from 'react';
import { SearchBar } from './search-bar';
import { TabSubjectBooks } from './tab-subject-books';

type SearchLayoutProps = {
  getCategory: (payload: string) => void;
  getQuery: (query: string, type: 'name' | 'author') => void;
  query: string;
}
export const SearchLayout = ({ children, getCategory, getQuery, query }: PropsWithChildren<SearchLayoutProps>) => {
  return (
    <div className='container'>
      <SearchBar setQuery={getQuery} query={query}/>
      <TabSubjectBooks returnSubject={getCategory} disabled={!!query} />
      {children}
    </div>
  )
}