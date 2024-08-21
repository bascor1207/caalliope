import { Tabs, Tab } from '@nextui-org/react';
import { FC, useState } from 'react';

import { PublishingSection } from './publishing-section';
import { ReviewSection } from './review-section';
import { BooksModel } from '@/modules/books/model/books.model';

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
};

export const TabBookInfo: FC<Props> = ({ book }) => {
  const [selectedTab, setSelectedTab] = useState(SUBJECTS_TAB[0].value);

  return (
    <div>
      <Tabs
        aria-label='Book Info Tabs'
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          setSelectedTab(key as string);
        }}
        classNames={classNames}
      >
        {SUBJECTS_TAB.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <div className='mt-8'>
        {selectedTab === '0' && <PublishingSection book={book} />}
        {selectedTab === '1' && <ReviewSection book={book} />}
      </div>
    </div>
  );
};
