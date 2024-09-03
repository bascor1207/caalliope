'use server';

import type { ReactNode } from 'react';

import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { getBooksByUsecase } from '@/modules/books/usecases/get-catalog/core/get-books-by.usecase';
import { getBooksUseCase } from '@/modules/books/usecases/get-catalog/core/get-books.usecase';
import { BooksCatalog } from '@/modules/books/usecases/get-catalog/ui/components/book-card-catalog';
import { NoResults } from '@/modules/books/usecases/get-catalog/ui/components/no-results';
import { getBooksViewModel } from '@/modules/books/usecases/get-catalog/ui/get-books/get-books.viewmodel';
import { ssrApp } from '@/modules/main.ssr';

export const prefetchCatalogLayout = async ({ searchParams }: {searchParams?: { [key: string]: string | undefined }}) => {
    const store = ssrApp.store;
    const subject = searchParams?.subject || '';
    const type = searchParams?.type as 'author' | 'name' || '';
    const search = searchParams?.search || '';

    if (subject.trim() === '') {
        await store.dispatch(getBooksUseCase());
    }
    if (subject && !search) {
        await store.dispatch(getBooksByUsecase({ type: 'genre', value: subject }));
    }
    if (type && search) {
        if (search.includes('+')) search.replace('+', ' ')
        await store.dispatch(getBooksByUsecase({ type, value: search }));
    }

    const viewmodel = getBooksViewModel()(store.getState())

    const withoutQueryNode: ReactNode = (() => {
        switch (viewmodel.type) {
            case 'gettingBooksPending':
                return <CustomSpinner />;
            case 'gettingBooksRejected':
                return <div>Oops...</div>;
            case 'gettingBooksFulfilled': {
                if (viewmodel.books.length < 1) {
                    return (
                        <NoResults />
                    );
                }
                return (
                    <BooksCatalog books={viewmodel.books} />
            );
            }
            default:
                return null;
        }
    })();

    const withQueryNode: ReactNode = (() => {
        switch (viewmodel.type) {
            case 'gettingBooksPending':
                return <CustomSpinner />;
            case 'gettingBooksRejected':
                return <div>Oops...</div>;
            case 'gettingBooksFulfilled': {
                if (viewmodel.books.length < 1) {
                    return (
                        <NoResults />
                    );
                }
                return (
                    <BooksCatalog books={viewmodel.books} />
                );
            }
            default:
                return null;
        }
    })();

    return { withQueryNode, withoutQueryNode, query: !!search };
}
