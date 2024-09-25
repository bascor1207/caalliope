import { Tab, Tabs } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';

import type { FC, PropsWithChildren } from 'react';

import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';


type TabBooksProps = {
  disabled?: boolean;
}

export const TabSubjectBooks: FC<PropsWithChildren<TabBooksProps>> = ({ disabled }) => {
  const { t } = useTranslation();
  const SUBJECTS_TAB = [
    { id: 0, label: t('subjects.all'), value: '' },
    { id: 1, label: t('subjects.computers'), value: 'computers' },
    { id: 2, label: t('subjects.education'), value: 'education' },
    { id: 3, label: t('subjects.programmers'), value: 'computer programmers' },
    { id: 4, label: t('subjects.languageArts'), value: 'language arts & disciplines' },
    { id: 5, label: t('subjects.prolog'), value: 'prolog' },
    { id: 6, label: t('subjects.horror'), value: 'horror' },
    { id: 7, label: t('subjects.biography'), value: 'biography' },
    { id: 8, label: t('subjects.selfDevelopment'), value: 'developpement' },
    { id: 9, label: t('subjects.history'), value: 'history' },
    { id: 10, label: t('subjects.theatre'), value: 'theatre' },
    { id: 11, label: t('subjects.philosophy'), value: 'philosophy' },
    { id: 12, label: t('subjects.mystery'), value: 'mystery' },
    { id: 13, label: t('subjects.science'), value: 'science' },
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

  const classNames = {
    tab: 'text-custom-dark-purple', cursor: 'cursor-pointer'
  };

  return (
      <>
        {isLoading && <CustomSpinner />}
        <div className='flex items-center justify-center my-4'>
          <div className='w-full overflow-x-auto flex items-center justify-center'>
            <Tabs
                aria-label='Dynamic tabs'
                items={SUBJECTS_TAB}
                classNames={classNames}
                className='flex whitespace-nowrap no-scrollbar'
                onSelectionChange={(e) => handleTabChange(e.toString())}
                isDisabled={disabled}
                defaultSelectedKey={selectedKey?.value || ''}
            >
              {(item) => (
                  <Tab key={item.value} title={item.label} />
              )}
            </Tabs>
          </div>
        </div>
      </>
  );
};
