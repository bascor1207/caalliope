import { Tabs, Tab } from '@nextui-org/react';
import { useState } from 'react';

import type { BooksModel } from '@/modules/books/model/books.model';
import type { FC } from 'react';

import { EditionSection } from '@/modules/books/get-one-book/ui/components/edition-section';
import { ReviewSection } from '@/modules/books/get-one-book/ui/components/review-section';

type Props = {
    book: BooksModel.Book;
}

const SUBJECTS_TAB = [
    { id: 0, label: 'Editions', value: 'edition' },
    { id: 1, label: 'Critiques', value: 'review' }
];

const classNames = {
    tab: 'text-custom-dark-purple',
    cursor: 'cursor-pointer',
    tabContent: 'w-full',
    tabPanel: 'w-full',
};

export const TabBookInfo: FC<Props> = ({ book }) => {
    const [selectedTab, setSelectedTab] = useState(SUBJECTS_TAB[0].value);

    return (
        <div className='flex flex-col'>
            <Tabs
                aria-label='Book Info Tabs'
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                classNames={classNames}
                className='flex justify-center mb-6'
            >
                {SUBJECTS_TAB.map((tab) => (
                    <Tab
                        key={tab.id}
                        title={tab.label}
                        value={tab.value}
                        className='h-16 flex items-center justify-center m-4'
                    />
                ))}
            </Tabs>

            <div className='mt-4 w-full'>
                {selectedTab === '0' && <EditionSection book={book} />}
                {selectedTab === '1' && <ReviewSection book={book} />}
            </div>
        </div>
    );
};
