'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBooksUseCase } from '@/modules/books/get-books/usecase/get-books.usecase';
import { AppDispatch, RootState } from '@/modules/store/create-store';
import { BooksListBySubject } from '@/modules/books/get-books/ui/components/books-list-by-subject';
import { SearchLayout } from '@/modules/books/get-books/ui/components/search-layout';
import { getBooksByNameViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-name.viewmodel';
import { getBooksByAuthorViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-author.viewmodel';
import { NoResults } from '@/modules/books/get-books/ui/components/no-results';
import { BookCard } from '@/modules/books/get-books/ui/components/book-card';

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [subject, setSubject] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getBooksUseCase());
  }, []);

  const booksByName = useSelector((state: RootState) => getBooksByNameViewmodel(query)(state));
  const booksByAuthor = useSelector((state: RootState) => getBooksByAuthorViewmodel(query)(state));

  const getSubject = (subj: string) => {
    if (subj === subject) {
      return setSubject('');
    }
    setSubject(subj);
  };

  const getQuery = (query: string) => {
    setQuery(query);
  };

  const renderedNode: ReactNode = (() => {
    let viewmodel = booksByName;
    if (viewmodel.length === 0) {
      viewmodel = booksByAuthor;
    }

    if (viewmodel.length === 0) {
      return <NoResults />;
    }

    return viewmodel.map((book) => (
      <BookCard
        key={book.id}
        book={book}
      />
    ));
  })();

  return (
    <SearchLayout getQuery={getQuery} query={query} getCategory={getSubject}>
      {query !== '' ? renderedNode : <BooksListBySubject subject={subject} />}
    </SearchLayout>
  );
}
