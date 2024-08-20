import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';
import { authUser } from '@/modules/auth/usecases/auth.user';

export const AuthSignInForm = () => {
    const formItems = [
        { id: 'login', name: 'login', label: 'Login' },
        { id: 'password', name: 'password', label: 'Password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.LoginFormSchema, label: string}>;


    return (
        <CustomForm
            items={formItems}
            schema={AuthModel.signInFormSchema}
            action={authUser}
        />
    )
}
