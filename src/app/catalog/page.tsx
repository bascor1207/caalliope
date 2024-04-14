'use client'
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBooksUseCase } from '@/modules/books/get-books/usecase/get-books.usecase';
import { AppDispatch } from '@/modules/store/create-store';
import { BooksListBySubject } from '@/modules/books/get-books/ui/components/books-list-by-subject';
import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';
import { SearchLayout } from '@/modules/books/get-books/ui/components/search-layout';
import { getBooksByNameViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-name.viewmodel';

const CatalogPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [subject, setSubject] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        dispatch(getBooksUseCase(/*{ connectedUser: true }*/))
    }, []);

    const viewmodel = useSelector(getBooksByNameViewmodel(query));

    
    const getsubject = (categ: string) => {
        if (categ === subject) {
        return setSubject('');
        }
        setSubject(categ);
    };

    const getQuery = (query: string) => {
        setQuery(() => query);
    };

    const renderedNode: ReactNode = (() => {
        return viewmodel.map((book) => (
          <BookCard
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
}

export default CatalogPage;
