import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';

export const AuthSignUpForm = () => {
    const formItems = [
        { id: 'name', name: 'name', label: 'Name' },
        { id: 'firstName', name: 'firstName', label: 'First name' },
        { id: 'email', name: 'email', label: 'Email' },
        { id: 'login', name: 'login', label: 'Login' },
        { id: 'password', name: 'password', label: 'Password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.AuthFormSchema, label: string}>;


    return (
        <CustomForm
            items={formItems}
            schema={AuthModel.signUpFormSchema}
            action={authUser}
        />
    )
}
