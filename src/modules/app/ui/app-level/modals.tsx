'use client';
import dynamic from 'next/dynamic';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { ContactForm } from '@/modules/app/ui/app-level/contact-form';
import { CustomToast } from '@/modules/app/ui/app-level/custom-toast';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { selectContactFormState, selectInformativeSpinner } from '@/modules/user/core/store/user.selectors';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    const isLoading = useAppSelector(selectInformativeSpinner);
    const contactFormStatus = useAppSelector(selectContactFormState);

    return (
        <>
            <AuthModal />
            <CustomToast />

            {contactFormStatus === 'displayed' && (
                <ContactForm formType='modal' />
            )}

            {isLoading && (
                <CustomSpinner />
            )}
        </>
    )
}
