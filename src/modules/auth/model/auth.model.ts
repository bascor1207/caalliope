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

    export const AUTH_TYPES = {
        SIGN_IN: 'signIn',
        SIGN_UP: 'signUp',
        EMPTY: ''
    } as const;

    export type AuthUserPayload = {
        email: string;
        password: string;
    }

    export type AuthenticatedUser = {
        id: string;
    }

    export type RegisterUserReturn = {
        id: string; email: string, lastName: string; firstName: string; roles: Array<'user' | 'admin'>; username: string; password: string;
    }

    export type RegisteredUser = {
        id: string; username: string; firstName: string; lastName: string; email: string; avatar: Avatar;
        myBooksToRead: []; myInProgressBooks: []; myAlreadyReadBooks: [];
        myAbandonedBooks: []; myWishlist: []; roles: Array<'user' | 'admin'>;
        password: string;
    }

    export type Avatar = {
        url: string;
    }

    export type RefreshTokenPayload = {
        token: string;
    }

    export type RefreshedToken = {
        id: string;
    }
}
