import { Tab, Tabs } from '@nextui-org/react';
import type { FC, PropsWithChildren } from 'react';

type TabBooksProps = {
  returnSubject: (value: string) => void;
  disabled: boolean;
};

export const TabSubjectBooks: FC<PropsWithChildren<TabBooksProps>> = ({
    returnSubject, disabled
}) => {
  const SUBJECTS_TAB = [
    { id: 0, label: 'Tout', value: '' },
    { id: 1, label: 'Fantasie', value: 'fantasy' },
    { id: 2, label: 'Policier', value: 'crime' },
    { id: 3, label: 'Fantastique', value: 'fantastic' },
    { id: 4, label: 'Romance', value: 'romance' },
    { id: 5, label: 'Science-fiction', value: 'sf' },
    { id: 6, label: 'Epouvante', value: 'horror' },
    { id: 7, label: 'Biographie', value: 'biography' },
    { id: 8, label: 'Développement personnel', value: 'developpement' },
    { id: 9, label: 'Historique', value: 'history' },
    { id: 10, label: 'théatre', value: 'theatre' },
    { id: 11, label: 'Philosophie', value: 'philosophy' },
    { id: 12, label: 'Mystère', value: 'mystery' },
    { id: 13, label: 'Science', value: 'science' },
  ];

  const labelSubject = (value: string) => {
    returnSubject(value);
  };

  const classNames=
      { tab: 'text-custom-dark-purple', cursor: 'cursor-pointer' }


  return (
      <div className='flex items-center justify-center my-4'>
        <Tabs
            aria-label='Dynamic tabs' items={SUBJECTS_TAB} classNames={classNames} onSelectionChange={(e) => labelSubject(e.toString())}
            isDisabled={disabled}
        >
          {(item) => (
              <Tab key={item.value} title={item.label} />
          )}
        </Tabs>
      </div>
  );
};
