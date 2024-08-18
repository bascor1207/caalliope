'use client';
import { Button } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthModalVisible, toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { AuthForm } from '@/modules/auth/ui/auth.form';
import { AppDispatch } from '@/modules/store/create-store';
import { FC } from 'react';
import { CustomModal } from '@/modules/ui/component-level/custom.modal';

export const AuthModal: FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const authModalVisible = useSelector(selectAuthModalVisible());

    const onCustomClose = () => {
        dispatch(toggleAuthModal(false))
    }

    return (
        <CustomModal
            hideModal={onCustomClose} isShown={authModalVisible}
            modalTitle='SignUp'
            modalContent={<AuthForm />}
             modalFooter={
                 <>
                     <Button color='danger' variant='light'>Close</Button>
                     <Button color='success' variant='light'>Submit</Button>
                 </>
            }
        />
    )
}
