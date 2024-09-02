'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { BookCard } from '@/modules/books/get-books/ui/components/book-card';
import { BooksListBySubject } from '@/modules/books/get-books/ui/components/books-list-by-subject';
import { SearchLayout } from '@/modules/books/get-books/ui/components/search-layout';
import { getBooksByAuthorViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-author.viewmodel';
import { getBooksByNameViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-name.viewmodel';
import { getBooksUseCase } from '@/modules/books/get-books/usecase/get-books.usecase';
import { AddBookForm } from '@/modules/books/usecases/create-book/ui/forms/add-book-form';
import { CreateBookPage } from '@/modules/books/usecases/create-book/ui/pages/create-book.page';

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
          <CreateBookPage>
            <AddBookForm />
          </CreateBookPage>
      );
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
