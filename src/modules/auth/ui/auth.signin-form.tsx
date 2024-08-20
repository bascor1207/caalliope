import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';

export const AuthSignInForm = () => {
    const formItems = [
        { id: 'login', name: 'login', label: 'Login', type: 'text' },
        { id: 'password', name: 'password', label: 'Password', type: 'password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.LoginFormSchema, label: string, type: string}>;


    return (
        <CustomForm
            items={formItems}
            schema={AuthModel.signInFormSchema}
            action={authUser}
        />
    )
}
