import { z } from 'zod';
import i18n from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UsersModel {
    const usernameSchema = z.string().min(1, { message: i18n.t('form.errors.required') });
    const emailSchema = z.string().email({ message: i18n.t('form.errors.invalidEmail') });
    const passwordSchema = z.string().min(8, { message: i18n.t('form.errors.passwordTooShort') });

    export const editProfileFormSchema = z.object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
    });

    export type EditProfileForm = z.infer<typeof editProfileFormSchema>;

    export type User = {
        id: string; username: string; firstName: string; lastName: string; email: string; avatar: object;
        myBooksToRead: ToReadBook[]; myInProgressBooks: InProgressBook[]; myAlreadyReadBooks: AlreadyReadBook[];
        myAbandonedBooks: AbandonedBook[]; myWishlist: WishBook[]; roles: Array<'user' | 'admin'>;
        password: string;
    }

    export type BaseUserBook = {
        id: number;
        title: string;
        type: string;
        image: string;
    }

    export type ToReadBook = BaseUserBook & {
        status: 'toRead',
        id: number;
        title: string;
        type: string;
        image: string;
    }

    export type InProgressBook = BaseUserBook & {
        status: 'reading',
        id: number;
        title: string;
        type: string;
        image: string;
    }

    export type AlreadyReadBook = BaseUserBook & {
        status: 'read',
        id: number;
        title: string;
        type: string;
        image: string;
    }

    export type AbandonedBook = BaseUserBook & {
        status: 'abandoned',
        id: number;
        title: string;
        type: string;
        image: string;
    }

    export type WishBook = BaseUserBook & {
        status: 'wishlist',
        id: number;
        title: string;
        type: string;
        image: string;
    }
}
