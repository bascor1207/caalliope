import { PropsWithChildren } from 'react';
import { SearchBar } from './search-bar';
import { TabSubjectBooks } from './tab-subject-books';

import styles from './search-layout.module.scss';

type SearchLayoutProps = {
  getCategory: (payload: string) => void;
  getQuery: (payload: string) => void;
  query: string
}
export const SearchLayout = ({ children, getCategory, getQuery, query }: PropsWithChildren<SearchLayoutProps>) => {
  return (
    <div className={styles.container}>
      <SearchBar setQuery={getQuery} query={query}/>
      <TabSubjectBooks returnSubject={getCategory} disabled={!!query} />
      {children}
    </div>
  )
}