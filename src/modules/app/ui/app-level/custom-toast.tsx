import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectInformativeToast } from '@/modules/user/core/store/user.selectors';
import { informUser } from '@/modules/user/core/store/user.slice';


export const CustomToast = () => {
    const dispatch = useDispatch<AppDispatch>()
    const toast = useAppSelector(selectInformativeToast)
    const baseClasses = 'fixed bottom-5 right-5 p-4 rounded shadow-lg flex items-center space-x-2';

    const toastClasses = twMerge(
        baseClasses,
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(informUser({ message: '', status: 'hidden', type: 'noTyped' }))
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return toast.status === 'displayed' && (
        <div className={toastClasses}>
            {toast.type === 'success' ? (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    className='w-6 h-6'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
            ) : (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    className='w-6 h-6'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
            )}
            <span>{toast.message}</span>
        </div>
    );
}
