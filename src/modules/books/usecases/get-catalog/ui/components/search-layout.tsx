import type { PropsWithChildren } from 'react';

import { SearchBar } from '@/modules/books/usecases/get-catalog/ui/components/search-bar';
import { TabSubjectBooks } from '@/modules/books/usecases/get-catalog/ui/components/tab-subject-books';


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
