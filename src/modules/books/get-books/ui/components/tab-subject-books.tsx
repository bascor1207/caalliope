import { Box, Tab, Tabs } from '@mui/material';
import { FC, useState } from 'react';


type TabBooksProps = {
  returnSubject: (value: string) => void;
  disabled: boolean;
};

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
  { id: 12, label: 'Mystère', value: 'mistery' },
  { id: 13, label: 'Science', value: 'science' },
];

export const TabSubjectBooks: FC<TabBooksProps> = ({
    returnSubject, disabled
}: TabBooksProps) => {
  const [value, setValue] = useState('');

  const labelSubject = (value: string) => {
    returnSubject(value);
  };

  return (
    <Box sx={{ maxWidth: { xs: 500, sm: 1500 }, margin: '10px' }}>
      <Tabs
        className='tabs'
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
      >
        {SUBJECTS_TAB.map((tab) => (
          <Tab
            className='tab'
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
