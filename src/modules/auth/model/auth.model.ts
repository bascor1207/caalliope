import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthModel {
    export const signInFormSchema = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        firstName: z.string().min(1, { message: 'First name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        login: z.string().min(1, { message: 'Login is required' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    });

    export type AuthFormSchema = z.infer<typeof signInFormSchema>
}
