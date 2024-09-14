'use client';
import { useTranslation } from 'react-i18next';

import type { NextPage } from 'next';

const CancelPage: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
      <h1 className='text-2xl font-bold text-red-600'>{t('donate.cancelTitle')}</h1>
      <p className='mt-4 text-lg text-gray-700'>
        {t('donate.cancel')}
      </p>
    </div>
  );
};

export default CancelPage;