import { useAuthForm } from '@/modules/auth/core/form/use-auth-form';
import { Controller } from 'react-hook-form';
import React from 'react';
import { Input } from '@nextui-org/react';

export const AuthForm = () => {
    const authForm = useAuthForm();


    return (
        <form onSubmit={authForm.handleSubmit(authForm.onSubmit)} className='space-y-4'>
            <div>
                <Controller
                    name='name'
                    control={authForm.control}
                    render={({ field }) => (
                        <Input
                            classNames={authForm.classNames} onClear={() => authForm.resetField(field.name)}
                            label='Name' id='name' {...authForm.props} {...field} />
                    )}
                />
                {authForm.errors.name && <p className='text-red-500'>{authForm.errors.name.message}</p>}
            </div>
            <div>
                <Controller
                    name='firstName'
                    control={authForm.control}
                    render={({ field }) => (
                         <Input
                             classNames={authForm.classNames} onClear={() => authForm.resetField(field.name)}
                             label='First name' id='firstName' {...authForm.props} {...field} />
                    )}
                />
                {authForm.errors.firstName && <p className='text-red-500'>{authForm.errors.firstName.message}</p>}
            </div>
            <div>
                <Controller
                    name='email'
                    control={authForm.control}
                    render={({ field }) => (
                         <Input
                             classNames={authForm.classNames} onClear={() => authForm.resetField(field.name)}
                             label='Email' id='email' {...authForm.props} {...field} />
                    )}
                />
                {authForm.errors.email && <p className='text-red-500'>{authForm.errors.email.message}</p>}
            </div>
            <div>
                <Controller
                    name='login'
                    control={authForm.control}
                    render={({ field }) => (
                         <Input
                             classNames={authForm.classNames} onClear={() => authForm.resetField(field.name)}
                             label='Login' id='login' {...authForm.props} {...field} />
                    )}
                />
                {authForm.errors.login && <p className='text-red-500'>{authForm.errors.login.message}</p>}
            </div>
            <div>
                <Controller
                    name='password'
                    control={authForm.control}
                    render={({ field }) => (
                         <Input
                             classNames={authForm.classNames} onClear={() => authForm.resetField(field.name)}
                             label='Password' id='password' {...authForm.props} {...field} />
                    )}
                />
                {authForm.errors.password && <p className='text-red-500'>{authForm.errors.password.message}</p>}
            </div>
        </form>
    )
}
