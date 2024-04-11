import { Box, Tab, Tabs } from '@mui/material';
import { FC, useState } from 'react';

type TabBooksProps = {
  returnSubject: (value: string) => void;
  disabled: boolean;
};

const SUBJECTS_TAB = [
  { id: 0, label: 'Tout', value: '' },
  { id: 1, label: 'Fantasie', value: 'fantasie' },
  { id: 2, label: 'Policier', value: 'policier' },
  { id: 3, label: 'Fantastique', value: 'fantastique' },
  { id: 4, label: 'Romance', value: 'romance' },
  { id: 5, label: 'Science-fiction', value: 'sf' },
  { id: 6, label: 'Epouvante', value: 'epouvante' },
  { id: 7, label: 'Biographie', value: 'biographie' },
  { id: 8, label: 'Développement personnel', value: 'developpement' },
  { id: 9, label: 'Historique', value: 'historique' },
  { id: 10, label: 'théatre', value: 'theatre' },
  { id: 11, label: 'Philosophie', value: 'philosophie' },
];

export const TabSubjectBooks: FC<TabBooksProps> = ({
    returnSubject, disabled
}: TabBooksProps) => {
  const [value, setValue] = useState('');

  const labelSubject = (value: string) => {
    returnSubject(value);
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, margin: '10px' }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
      >
        {SUBJECTS_TAB.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.value}
            label={tab.label}
            onClick={() => {
                labelSubject(tab.value);
            }}
            disabled={disabled}
          />
        ))}
      </Tabs>
    </Box>
  );
};
