'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBooksUseCase } from '@/modules/books/get-books/usecase/get-books.usecase';
import { AppDispatch } from '@/modules/store/create-store';
import { BooksListBySubject } from '@/modules/books/get-books/ui/components/books-list-by-subject';
import { SearchLayout } from '@/modules/books/get-books/ui/components/search-layout';
import { getBooksByNameViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-name.viewmodel';
import { getBooksByAuthorViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-author.viewmodel';
import { BookCardCatalog } from '@/modules/books/get-books/ui/components/book-card-catalog';
import { NoResults } from '@/modules/books/get-books/ui/components/no-results';

const CatalogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subject, setSubject] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getBooksUseCase());
  }, [dispatch]);

  const booksByName = useSelector(getBooksByNameViewmodel(query));
  const booksByAuthor = useSelector(getBooksByAuthorViewmodel(query));

  const getsubject = (subj: string) => {
    console.log('Genre sélectionné:', subj);
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
      console.log('No books found matching the query');
      return <NoResults />;
    }

    return viewmodel.map((book) => (
      <BookCardCatalog
        key={book.id}
        book={book}
      />
    ));
  })();

  if (query !== '') {
    return (
      <SearchLayout getCategory={getsubject} query={query} getQuery={getQuery}>
        {renderedNode}
      </SearchLayout>
    );
  }

  return (
    <SearchLayout getQuery={getQuery} query={query} getCategory={getsubject}>
      <BooksListBySubject subject={subject} />
    </SearchLayout>
  );
};

export default CatalogPage;
