import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';

export const AuthSignUpForm = () => {
    const formItems = [
        { id: 'name', name: 'name', label: 'Name', type: 'text' },
        { id: 'firstName', name: 'firstName', label: 'First name', type: 'text' },
        { id: 'email', name: 'email', label: 'Email', type: 'text' },
        { id: 'login', name: 'login', label: 'Login', type: 'text' },
        { id: 'password', name: 'password', label: 'Password', type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.AuthFormSchema, label: string, type: string}>;


    return (
        <CustomForm
            items={formItems}
            schema={AuthModel.signUpFormSchema}
            action={authUser}
        />
    )
}
