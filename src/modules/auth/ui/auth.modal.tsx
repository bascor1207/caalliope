import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { selectAuthModalVisible, selectAuthType, toggleAuthModal } from '@/modules/auth/core/store/auth.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/modules/store/create-store';
import { useTranslation } from 'react-i18next';

export const AuthModal = () => {
    const dispatch = useDispatch<AppDispatch>()
    const authModalVisible = useSelector(selectAuthModalVisible());
    const authType = useSelector(selectAuthType());
    const { t } = useTranslation();

    const signInFormItems = [
        { id: 'login', name: 'login', label: 'Login', type: 'text' },
        { id: 'password', name: 'password', label: 'Password', type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.LoginFormSchema, label: string, type: string}>;

    const signUpFormItems = [
        { id: 'name', name: 'name', label: 'Name', type: 'text' },
        { id: 'firstName', name: 'firstName', label: 'First name', type: 'text' },
        { id: 'email', name: 'email', label: 'Email', type: 'text' },
        { id: 'login', name: 'login', label: 'Login', type: 'text' },
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

    return (
        <CustomForm
            items={signUpFormItems}
            schema={AuthModel.signUpFormSchema}
            action={authUser}
            formType='modal'
            onCustomClose={() => dispatch(toggleAuthModal({ visible: false, type: AuthModel.AUTH_TYPES.EMPTY }))}
            visibilityTrigger={authModalVisible}
            modalTitle={t('register.title')}
        />
    )
}
