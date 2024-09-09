'use client';
import type { NextPage } from 'next';

const CancelPage: NextPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50'>
      <h1 className='text-2xl font-bold text-red-600'>Payment Canceled</h1>
      <p className='mt-4 text-lg text-gray-700'>
        Your payment process has been canceled. If this was a mistake, please try again.
      </p>
      <a href='/' className='mt-4 text-blue-500 hover:underline'>
        Return to Home
      </a>
    </div>
  );
};

export default CancelPage;