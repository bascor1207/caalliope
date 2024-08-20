import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
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
  { id: 12, label: 'Mystère', value: 'mystery' },
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
      <Tabs aria-label='Dynamic tabs' items={SUBJECTS_TAB}>
        {(item) => (
            <Tab key={item.id} title={item.label} onClick={() => labelSubject(item.value)}>
              <Card>
                <CardBody>
                  {item.label}
                </CardBody>
              </Card>
            </Tab>
        )}
      </Tabs>
      // <Tabs defaultValue='Tout' className='w-[400px]'>
      //   <TabsList>
      //     {SUBJECTS_TAB.map((tab) => (
      //          <TabsTrigger
      //            className='tab'
      //            key={tab.id}
      //            value={tab.value}
      //            onClick={() => {
      //                labelSubject(tab.value);
      //            }}
      //         >
      //            {tab.label}
      //         </TabsTrigger>
      //         ))}
      //   </TabsList>
      //   <TabsContent value='account'>Make changes to your account here.</TabsContent>
      //   <TabsContent value='password'>Change your password here.</TabsContent>
      // </Tabs>
  );
};
