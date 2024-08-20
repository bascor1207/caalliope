'use client';
import { Button } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthModalVisible, selectAuthType, toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { AuthSignUpForm } from '@/modules/auth/ui/auth.signup-form';
import { AppDispatch } from '@/modules/store/create-store';
import { FC } from 'react';
import { CustomModal } from '@/modules/ui/component-level/custom.modal';
import { AuthSignInForm } from '@/modules/auth/ui/auth.signin-form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { useTranslation } from 'react-i18next';

export const AuthModal: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>()
    const authModalVisible = useSelector(selectAuthModalVisible());
    const authType = useSelector(selectAuthType());

    const onCustomClose = () => {
        dispatch(toggleAuthModal({ visible: false, type: AuthModel.AUTH_TYPES.EMPTY }))
    }

    const modalProps = {
        title:
            authType === AuthModel.AUTH_TYPES.SIGN_IN && t('loginPage.title') ||
            authType === AuthModel.AUTH_TYPES.SIGN_UP && t('register.title') ||
            '',
        content:
            authType === AuthModel.AUTH_TYPES.SIGN_IN && <AuthSignInForm/> ||
            authType === AuthModel.AUTH_TYPES.SIGN_UP && <AuthSignUpForm/> ||
            <div>{t('error')}</div>
    }

    return (
        <CustomModal
            hideModal={onCustomClose} isShown={authModalVisible}
            modalTitle={modalProps.title}
            modalContent={modalProps.content}
            modalFooter={
                 <>
                     <Button color='danger' variant='light' onClick={onCustomClose}>Close</Button>
                     <Button color='success' variant='light'>Submit</Button>
                 </>
            }
        />
    )
}
