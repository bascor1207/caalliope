import { useAppSelector } from '@/modules/app/core/store/create-store';
import { selectAuthType } from '@/modules/auth/core/store/auth.selectors';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { registerUser } from '@/modules/auth/usecases/register.user';

export const ConnectionPage = () => {
    const authType = useAppSelector(selectAuthType);

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
                formType='plain'
            />
        )
    }


    return (
        <CustomForm
            items={signUpFormItems}
            schema={AuthModel.signUpFormSchema}
            action={registerUser}
            formType='plain'
        />
    )
}
