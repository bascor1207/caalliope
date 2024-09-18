'use client';
import { Tab, Tabs } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import type { FC, PropsWithChildren } from 'react';

import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';

type TabBooksProps = {
  disabled: boolean;
};

export const TabSubjectBooks: FC<PropsWithChildren<TabBooksProps>> = ({
     disabled
}) => {
  const SUBJECTS_TAB = [
    { id: 0, label: 'Tout', value: '' },
    { id: 1, label: 'Computers', value: 'computers' },
    { id: 2, label: 'Education', value: 'education' },
    { id: 3, label: 'Computer programmers', value: 'computer programmers' },
    { id: 4, label: 'Language Arts & Disciplines', value: 'language arts & disciplines' },
    { id: 5, label: 'Prolog', value: 'prolog' },
    { id: 6, label: 'Epouvante', value: 'horror' },
    { id: 7, label: 'Biographie', value: 'biography' },
    { id: 8, label: 'Développement personnel', value: 'developpement' },
    { id: 9, label: 'Historique', value: 'history' },
    { id: 10, label: 'Théatre', value: 'theatre' },
    { id: 11, label: 'Philosophie', value: 'philosophy' },
    { id: 12, label: 'Mystère', value: 'mystery' },
    { id: 13, label: 'Science', value: 'science' },
  ];
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const selectedKey = SUBJECTS_TAB.find((tab) => tab.value === searchParams.get('subject'));

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subject', key);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    })
  };

  const classNames=
      { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' }

  return (
      <>
        {isLoading && <CustomSpinner />}
        <div className='flex items-center justify-center my-4'>
          <Tabs
              aria-label='Dynamic tabs' items={SUBJECTS_TAB} classNames={classNames} onSelectionChange={(e) => handleTabChange(e.toString())}
              isDisabled={disabled} defaultSelectedKey={selectedKey?.value || ''}
          >
            {(item) => (
                <Tab key={item.value} title={item.label} />
            )}
          </Tabs>
        </div>
      </>
  );
};
