import type { PropsWithChildren } from 'react';

import { SearchBar } from './search-bar';
import { TabSubjectBooks } from './tab-subject-books';

type SearchLayoutProps = {
  query: boolean;
}
export const SearchLayout = ({ children, query }: PropsWithChildren<SearchLayoutProps>) => {
  return (
    <div>
      <SearchBar />
      <TabSubjectBooks disabled={query} />
        {children}
    </div>
  )
}
