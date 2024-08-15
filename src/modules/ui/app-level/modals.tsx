'use client';
import dynamic from 'next/dynamic';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    return (
        <AuthModal />
    )
}
