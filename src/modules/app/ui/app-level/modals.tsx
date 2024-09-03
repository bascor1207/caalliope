'use client';
import dynamic from 'next/dynamic';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomToast } from '@/modules/app/ui/app-level/custom-toast';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { selectInformativeSpinner } from '@/modules/user/core/store/user.selectors';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    const isLoading = useAppSelector(selectInformativeSpinner);

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
