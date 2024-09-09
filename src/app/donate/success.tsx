'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { NextPage } from 'next';

const SuccessPage: NextPage = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const { session_id } = router.query;

    if (session_id && typeof session_id === 'string') {
      setSessionId(session_id);
      // Vous pouvez ici appeler une API pour vérifier l'état du paiement, enregistrer des informations, etc.
    }
  }, [router.query]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h1 className='text-2xl font-bold text-green-600'>{t('donate.successTitle')}</h1>
      <p className='mt-4 text-lg text-gray-700'>
        {t('donate.thanks')}
      </p>
      {sessionId && (
        <p className='mt-2 text-gray-500'>
          Session ID: <code className='bg-gray-100 p-1 rounded'>{sessionId}</code>
        </p>
      )}
    </div>
  );
};

export default SuccessPage;
