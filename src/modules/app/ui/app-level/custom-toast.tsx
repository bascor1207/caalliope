import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectInformativeToast } from '@/modules/user/core/store/user.selectors';
import { informUser } from '@/modules/user/core/store/user.slice';

export const CustomToast = () => {
    const toast = useAppSelector(selectInformativeToast);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (toast.status === 'displayed') {
            const timer = setTimeout(() =>
                    dispatch(informUser({ status: 'hidden', type: 'noTyped', message: '' }))
                , 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const baseClasses = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 rounded-xl shadow-lg flex items-center space-x-3 transition-all duration-300 ease-in-out';

    const toastClasses = twMerge(
        baseClasses,
        toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200',
        toast.status === 'displayed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    );

    const iconClasses = 'w-6 h-6';

    const SuccessIcon = () => (
        <svg xmlns='http://www.w3.org/2000/svg' className={iconClasses} viewBox='0 0 20 20' fill='currentColor'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
        </svg>
    );

    const ErrorIcon = () => (
        <svg xmlns='http://www.w3.org/2000/svg' className={iconClasses} viewBox='0 0 20 20' fill='currentColor'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
        </svg>
    );

    const toastContent = (
        <div className={toastClasses}>
            {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
            <span className='font-medium'>{toast.message}</span>
        </div>
    );

    if (toast.status === 'displayed') {
        return createPortal(toastContent, document.body);
    }
    return null;
};
