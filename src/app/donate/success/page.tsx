'use client';
import { useTranslation } from 'react-i18next';

import type { NextPage } from 'next';

const SuccessPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h1 className='text-2xl font-bold text-green-600'>{t('donate.successTitle')}</h1>
      <p className='mt-4 text-lg text-gray-700'>
        {t('donate.thanks')}
      </p>
    </div>
  );
};

export default SuccessPage;
