import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthModel {
    export const signUpFormSchema = z.object({
        lastName: z.string().min(1, { message: 'Name is required' }),
        firstName: z.string().min(1, { message: 'First name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        username: z.string().min(1, { message: 'Login is required' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    });

    export const signInFormSchema = z.object({
        email: z.string().email({ message: 'Email is required' }),
        password: z.string().min(1, { message: 'Password is required' }),
    })

    export type AuthFormSchema = z.infer<typeof signUpFormSchema>
    export type LoginFormSchema = z.infer<typeof signInFormSchema>

    export type AuthUserPayload = {
        email: string;
        password: string;
    }

    export const AUTH_TYPES = {
        SIGN_IN: 'signIn',
        SIGN_UP: 'signUp',
        EMPTY: ''
    } as const;

    export type AuthenticatedUser = {
        id: number;
        access_token: string;
    }
}
