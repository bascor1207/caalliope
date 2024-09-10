'use client';
import dynamic from 'next/dynamic';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomToast } from '@/modules/app/ui/app-level/custom-toast';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { selectAuthModalVisible } from '@/modules/auth/core/store/auth.selectors';
import { selectContactFormState,
    selectEditProfileFormState,
    selectInformativeSpinner } from '@/modules/user/core/store/user.selectors';
import { ContactForm } from '@/modules/user/usecases/contact-us/ui/forms/contact-form';
import EditProfileForm from '@/modules/user/usecases/edit-profile/ui/forms/edit-profile.form';

 const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});


export const Modals = () => {
    const isLoading = useAppSelector(selectInformativeSpinner);
    const contactFormStatus = useAppSelector(selectContactFormState);
    const editProfileFormStatus = useAppSelector(selectEditProfileFormState);
    const authModalVisible = useAppSelector(selectAuthModalVisible);


    return (
        <>
            {authModalVisible && (
                <AuthModal />
            )}
            <CustomToast />

            {contactFormStatus === 'displayed' && (
                <ContactForm formType='modal' />
            )}

            {editProfileFormStatus === 'displayed' && (
                <EditProfileForm />
            )}

            {isLoading && (
                <CustomSpinner />
            )}
        </>
    )
}
