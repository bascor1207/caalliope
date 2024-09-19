'use client';
import dynamic from 'next/dynamic';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomToast } from '@/modules/app/ui/app-level/custom-toast';
import { CustomSpinner } from '@/modules/app/ui/app-level/custom.spinner';
import { selectAuthModalVisible } from '@/modules/auth/core/store/auth.selectors';
import { selectBookDetailsModalState } from '@/modules/books/get-one-book/core/get-book.selectors';
import { selectCreateEditionForm } from '@/modules/books/usecases/create-edition/core/store/create-edition.selectors';
import { selectUpdateEditionForm } from '@/modules/books/usecases/update-edition/core/store/update-edition.selectors';
import {
    selectContactFormState, selectEditAvatarFormState,
    selectEditProfileFormState,
    selectInformativeSpinner
} from '@/modules/user/core/store/user.selectors';
import { ContactForm } from '@/modules/user/usecases/contact-us/ui/forms/contact-form';
import EditAvatarForm from '@/modules/user/usecases/edit-profile/ui/forms/edit-avatar.form';
import { EditProfileForm } from '@/modules/user/usecases/edit-profile/ui/forms/edit-profile.form';
import { DetailedUserBookModal } from '@/modules/user/usecases/get-user/ui/components/detailed-user-book.modal';

const AuthModal = dynamic(() => import('@/modules/auth/ui/auth.modal').then((module) => module.AuthModal), {
    ssr: false,
});
const CreateEditionModal = dynamic(() => import('@/modules/books/usecases/create-edition/ui/forms/add-edition-form').then((module) => module.AddEditionForm), {
    ssr: false,
});
const UpdateEditionModal = dynamic(() => import('@/modules/books/usecases/update-edition/ui/forms/update-book-edition-form').then((module) => module.UpdateBookEditionModal), {
    ssr: false
})


export const Modals = () => {
    const isLoading = useAppSelector(selectInformativeSpinner);
    const contactFormStatus = useAppSelector(selectContactFormState);
    const editProfileFormStatus = useAppSelector(selectEditProfileFormState);
    const editAvatarFormStatus = useAppSelector(selectEditAvatarFormState);
    const authModalVisible = useAppSelector(selectAuthModalVisible);
    const booksDetailsModalStatus = useAppSelector(selectBookDetailsModalState);
    const updateEditionFormStatus = useAppSelector(selectUpdateEditionForm);
    const createEditionFormStatus = useAppSelector(selectCreateEditionForm);

    return (
        <>
            {authModalVisible && (
                <AuthModal />
            )}

            {typeof window !== 'undefined' && (
                <CustomToast />
            )}

            {contactFormStatus === 'displayed' && (
                <ContactForm formType='modal' />
            )}

            {booksDetailsModalStatus === 'displayed' && (
                <DetailedUserBookModal />
            )}

            {editProfileFormStatus === 'displayed' && (
                <EditProfileForm />
            )}

            {editAvatarFormStatus === 'displayed' && (
                <EditAvatarForm />
            )}


            {updateEditionFormStatus === 'displayed' && (
                <UpdateEditionModal />
            )}

            {createEditionFormStatus === 'displayed' && (
                <CreateEditionModal />
            )}

            {isLoading && (
                <CustomSpinner />
            )}
        </>
    )
}
