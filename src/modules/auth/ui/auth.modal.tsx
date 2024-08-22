import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/modules/store/create-store';
import { useTranslation } from 'react-i18next';
import { registerUser } from '@/modules/auth/usecases/register.user';
import { selectAuthModalVisible, selectAuthType } from '@/modules/auth/core/store/auth.selectors';

export const AuthModal = () => {
    const dispatch = useDispatch<AppDispatch>()
    const authModalVisible = useAppSelector(selectAuthModalVisible);
    const authType = useAppSelector(selectAuthType);
    const { t } = useTranslation();

    const signInFormItems = [
        { id: 'email', name: 'email', label: 'Email', type: 'email' },
        { id: 'password', name: 'password', label: 'Password', type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.LoginFormSchema, label: string, type: string}>;

    const signUpFormItems = [
        { id: 'lastName', name: 'lastName', label: 'Last name', type: 'text' },
        { id: 'firstName', name: 'firstName', label: 'First name', type: 'text' },
        { id: 'email', name: 'email', label: 'Email', type: 'email' },
        { id: 'username', name: 'username', label: 'Username', type: 'text' },
        { id: 'password', name: 'password', label: 'Password', type: 'password' },
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
