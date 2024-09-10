'use client';
import { Button } from '@nextui-org/react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { AuthModel } from '@/modules/auth/core/model/auth.model';
import { selectAuthType } from '@/modules/auth/core/store/auth.selectors';
import { switchAuthFormType } from '@/modules/auth/core/store/auth.slice';
import { authUser } from '@/modules/auth/usecases/auth.user';
import { registerUser } from '@/modules/auth/usecases/register.user';

type ConnectionPageProps = {
    type?: 'signIn' | 'signUp';
}

export const ConnectionPage: FC<ConnectionPageProps> = ({ type }) => {
    const authType = useAppSelector(selectAuthType);
    const dispatch = useDispatch<AppDispatch>();

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

    const handleChange = async (path: string) => {
       window.location.replace(`/auth/${path}`);
        dispatch(switchAuthFormType({ type: 'signUp' }))
    }

    if (type === AuthModel.AUTH_TYPES.SIGN_IN || authType === AuthModel.AUTH_TYPES.SIGN_IN) {
        return (
            <section className='flex flex-col items-center justify-center w-full'>
                <div className='w-full max-w-md p-6'>
                    <CustomForm
                        items={signInFormItems}
                        schema={AuthModel.signInFormSchema}
                        action={authUser}
                        formType='plain'
                    />
                </div>

                <Button onPress={() => handleChange('sign-up')}>No account yet ? Sign up</Button>
            </section>
        )
    }


    return (
        <section className='flex flex-col items-center justify-center w-full'>
            <div className='w-full max-w-md p-6'>
                <CustomForm
                    items={signUpFormItems}
                    schema={AuthModel.signUpFormSchema}
                    action={registerUser}
                    formType='plain'
                />
            </div>
            <Button onPress={() => handleChange('sign-in')}>Already have an account ? Sign in</Button>
        </section>
    )
}
