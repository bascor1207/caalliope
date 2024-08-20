import { useAuthForm } from '@/modules/auth/core/form/use-auth-form';
import React from 'react';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/model/auth.model';

export const AuthForm = () => {
    const authForm = useAuthForm();

    const formItems = [
        { id: 'name', name: 'name', label: 'Name' },
        { id: 'firstName', name: 'firstName', label: 'First name' },
        { id: 'email', name: 'email', label: 'Email' },
        { id: 'login', name: 'login', label: 'Login' },
        { id: 'password', name: 'password', label: 'Password' },
    ] satisfies Array<{id: string, name: keyof AuthModel.AuthFormSchema, label: string}>;


    return (
        <form onSubmit={authForm.handleSubmit(authForm.onSubmit)} className='space-y-4'>
            <CustomForm
                items={formItems}
                schema={AuthModel.signInFormSchema}
                />
        </form>
    )
}
