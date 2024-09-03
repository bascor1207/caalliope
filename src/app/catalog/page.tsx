'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { BooksModel } from '@/modules/books/model/books.model';
import type { ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { getBooksUseCase } from '@/modules/books/usecases/get-catalog/core/get-books.usecase';
import { BookCard } from '@/modules/books/usecases/get-catalog/ui/components/book-card';
import { BooksListBySubject } from '@/modules/books/usecases/get-catalog/ui/components/books-list-by-subject';
import { NoResults } from '@/modules/books/usecases/get-catalog/ui/components/no-results';
import { SearchLayout } from '@/modules/books/usecases/get-catalog/ui/components/search-layout';
import { getBooksByAuthorViewmodel } from '@/modules/books/usecases/get-catalog/ui/get-books/get-books-by-author.viewmodel';
import { getBooksByNameViewmodel } from '@/modules/books/usecases/get-catalog/ui/get-books/get-books-by-name.viewmodel';


export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [subject, setSubject] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getBooksUseCase());
  }, []);

  const booksByName = useAppSelector(getBooksByNameViewmodel(query));
  const booksByAuthor = useAppSelector(getBooksByAuthorViewmodel(query));

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

    if (viewmodel.length < 1) {
      return (
          <NoResults />
      );
    }

    return viewmodel.map((book: BooksModel.Book) => (
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
