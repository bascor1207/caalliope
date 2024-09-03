'use client'
import type { ReactNode } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { BooksCarousel } from '@/modules/books/get-books/ui/components/books-carousel';
import { getBooksLastReleaseViewmodel } from '@/modules/books/usecases/get-last-release-books/ui/get-last-release-books.viewmodel';


export const BooksCarouselsLastRelease = () => {
    const viewmodel = useAppSelector(getBooksLastReleaseViewmodel());

    const nodeToRender: ReactNode = (() => {
        switch (viewmodel.type) {
            case 'gettingBooksLastReleasePending':
                return <CustomSpinner />;
            case 'gettingBooksLastReleaseRejected':
                return <div>Oops...</div>;
            case 'gettingBooksLastReleaseFulfilled':
                return (
                    <BooksCarousel slides={viewmodel.lastReleaseBooks} />
                );
        }
    })();

    return nodeToRender;
}
