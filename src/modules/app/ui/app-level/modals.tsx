'use client';
import dynamic from 'next/dynamic';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    const isLoading = false;
    return (
        <>
        <AuthModal />

        {isLoading && (
            <CustomSpinner />
        )}
        </>
    )
}
