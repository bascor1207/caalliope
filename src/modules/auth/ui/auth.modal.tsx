import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/core/model/auth.model';
import { selectAuthModalVisible, selectAuthType } from '@/modules/auth/core/store/auth.selectors';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { registerUser } from '@/modules/auth/usecases/register.user';

export const AuthModal = () => {
    const dispatch = useDispatch<AppDispatch>()
    const authModalVisible = useAppSelector(selectAuthModalVisible);
    const authType = useAppSelector(selectAuthType);
    const { t } = useTranslation();

    const signInFormItems = [
        { id: 'email', name: 'email', label: t('user.email'), type: 'email' },
        { id: 'password', name: 'password', label: t('user.password'), type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.LoginFormSchema, label: string, type: string}>;

    const signUpFormItems = [
        { id: 'lastName', name: 'lastName', label: t('user.lastName'), type: 'text' },
        { id: 'firstName', name: 'firstName', label: t('user.firstName'), type: 'text' },
        { id: 'email', name: 'email', label: t('user.email'), type: 'email' },
        { id: 'username', name: 'username', label: t('user.username'), type: 'text' },
        { id: 'password', name: 'password', label: t('user.password'), type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.AuthFormSchema, label: string, type: string}>;

    if (authType === AuthModel.AUTH_TYPES.SIGN_IN) {
        return (
            <CustomForm
                items={signInFormItems}
                schema={AuthModel.signInFormSchema}
                action={authUser}
                formType='modal'
                onCustomClose={() => dispatch(toggleAuthModal({ visible: false, type: AuthModel.AUTH_TYPES.EMPTY }))}
                visibilityTrigger={authModalVisible}
                modalTitle={t('loginPage.title')}
            />
        )
    }

    const onCloseModal = () => dispatch(toggleAuthModal({ visible: false, type: AuthModel.AUTH_TYPES.EMPTY }));

    return (
        <CustomForm
            items={signUpFormItems}
            schema={AuthModel.signUpFormSchema}
            action={registerUser}
            formType='modal'
            onCustomClose={onCloseModal}
            visibilityTrigger={authModalVisible}
            modalTitle={t('register.title')}
        />
    )
}
