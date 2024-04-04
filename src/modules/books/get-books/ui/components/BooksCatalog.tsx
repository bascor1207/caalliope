'use client';
import React from 'react';
import { useSelector } from 'react-redux';

import { exhaustiveGuard } from '@/modules/exhaustive-guards';
import { getBooksViewModel } from '@/modules/books/get-books/ui/get-books.viewmodel';

import BooksCarousel from '@/modules/books/get-books/ui/components/BooksCarousel';

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
                    return (
                        <BooksCarousel slides={viewModel.books} withExtraGap title={'Livres'}/>
                    )
                default:
                    return exhaustiveGuard(viewModel);
            }
        })();

    return (
        <div className={styles.container}>
            HELLO1
            { result }
        </div>
    )
}
