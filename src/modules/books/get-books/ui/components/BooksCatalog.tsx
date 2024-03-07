'use client';
import React from "react";
import { useSelector } from 'react-redux';

import {exhaustiveGuard} from "@/modules/exhaustive-guards";
import {getBooksViewModel} from "../get-books/get-books.viewmodel";

import {BookCard} from "@/modules/books/get-books/ui/components/BookCard";

import styles from './book-catalog.module.scss';

export const BooksCatalog = () => {
    const viewModel = useSelector(getBooksViewModel());
    const result: React.ReactNode = (() => {
            switch (viewModel.type) {
                case 'gettingBooksPending':
                    return <div>Loading...</div>;
                case 'gettingBooksRejected':
                    return <div>OOPS...</div>;
                case 'gettingBooksFulfilled':
                    return <div className={styles.catalog}>{viewModel.books.map((book) => <BookCard key={book.dateOfPublication} book={book}/>)}</div>;
                default:
                    return exhaustiveGuard(viewModel);
            }
        })();

    return (
        <div className={styles.container}>
            HELLO
            {result}
        </div>
    )
}
