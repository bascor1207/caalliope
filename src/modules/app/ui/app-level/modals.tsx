'use client';
import dynamic from 'next/dynamic';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { CustomToast } from '@/modules/app/ui/app-level/custom-toast';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    const isLoading = false;

    return (
        <>
        <AuthModal />
        <CustomToast />

        {isLoading && (
            <CustomSpinner />
        )}

        </>
    )
}
