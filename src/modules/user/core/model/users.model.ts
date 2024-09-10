import { z } from 'zod';

import i18n from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UsersModel {
    const usernameSchema = z.string().min(1, { message: i18n.t('form.errors.required') });
    const emailSchema = z.string().email({ message: i18n.t('form.errors.invalidEmail') });
    const passwordSchema = z.string().min(8, { message: i18n.t('form.errors.passwordTooShort') });

    export const editProfileFormSchema= (userInformations: Pick<UsersModel.User, 'username' | 'email' | 'password'>) =>
        z.object({
        username: usernameSchema.default(userInformations.username ?? ''),
        email: emailSchema.default(userInformations.email ?? ''),
        password: passwordSchema
    });

    export type EditProfileForm = z.infer<ReturnType<typeof editProfileFormSchema>>;

    export type User = {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: Avatar;
        myBooksToRead: BaseUserBook<'toRead'>[];
        myInProgressBooks: InProgressBook[];
        myAlreadyReadBooks: AlreadyReadBook[];
        myAbandonedBooks: AbandonedBook[];
        myWishlist: WishBook[];
        roles: Array<'user' | 'admin'>;
        password: string;
        waitingForValidationBooks?: BaseUserBook<''>[];
    }

    export type Avatar = {
        url: string;
    }

    export type BaseUserBook<T extends 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' | ''> = {
        id: number;
        title: string;
        type: string;
        image: string;
        status: T;
    }

    export type ToReadBook = BaseUserBook<'toRead'>

    export type InProgressBook = BaseUserBook<'reading'>

    export type AlreadyReadBook = BaseUserBook<'read'>

    export type AbandonedBook = BaseUserBook<'abandoned'>

    export type WishBook = BaseUserBook<'wishlist'>

    export const contactUsSchema = z.object({
        reason: z.string().min(1, { message: i18n.t('form.errors.required') }),
    })

    export type ContactUsForm = z.infer<typeof contactUsSchema>;
}
