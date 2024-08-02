import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { PublishingSection } from './publishing-section';
import { ReviewSection } from './review-section';

const SUBJECTS_TAB = [
  { id: 0, label: 'Editions', value: 'edition' },
  { id: 1, label: 'Critiques', value: 'review' }
];

export const TabBookInfo = () => {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ maxWidth: { xs: 500, sm: 1500 }, margin: '10px' }}>
      <Tabs
        className='tabs'
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
      >
        {SUBJECTS_TAB.map((tab) => (
          <Tab
            className='tab'
            key={tab.id}
            value={tab.value}
            label={tab.label}
            onClick={() => {
                setValue(tab.value);
            }}
          />
        ))}
      </Tabs>

      {value === 'edition' && <PublishingSection />}
      {value === 'review' && <ReviewSection />}
    </Box>
  );
};
