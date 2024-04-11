'use client';
import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';

import { BookCard } from '@/modules/books/get-books/ui/components/BookCard';
import { SearchLayout } from '@/modules/books/get-books/ui/components/search-layout';
import { BooksListBySubject } from '@/modules/books/get-books/ui/components/books-list-by-subject';
import { getBooksByNameViewmodel } from '@/modules/books/get-books/ui/get-books/get-books-by-name.viewmodel';

const BookPage = () => {
    const [subject, setSubject] = useState('');
    const [query, setQuery] = useState('');

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
};

export default BookPage;
