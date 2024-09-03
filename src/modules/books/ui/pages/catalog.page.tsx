'use client'

import type { FC, ReactNode } from 'react';

import { SearchLayout } from '@/modules/books/usecases/get-catalog/ui/components/search-layout';

type CatalogPageProps = {
    withQueryNode: ReactNode;
    withoutQueryNode: ReactNode;
    query: boolean;
}
export const CatalogPage: FC<CatalogPageProps> = ({ withQueryNode, withoutQueryNode, query }) => {
    return (
        <SearchLayout query={query}>
            {query ? withQueryNode : withoutQueryNode}
        </SearchLayout>
    );
}
