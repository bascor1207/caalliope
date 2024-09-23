import { z } from 'zod';

import i18n from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UsersModel {
    const usernameSchema = z.string().min(1, { message: i18n.t('form.errors.required') }).optional();
    const emailSchema = z.string().email({ message: i18n.t('form.errors.invalidEmail') }).optional();
    const passwordSchema = z.string().min(8, { message: i18n.t('form.errors.passwordTooShort') }).optional();

    export const editProfileFormSchema= (userInformations: Pick<UsersModel.User, 'username' | 'email' | 'password'>) =>
        z.object({
        username: usernameSchema.default(userInformations.username ?? ''),
        email: emailSchema.default(userInformations.email ?? ''),
        password: passwordSchema,
        avatar: avatarSchema.optional()
    });
    export type EditProfileForm = z.infer<ReturnType<typeof editProfileFormSchema>>;

    const MAX_UPLOAD_SIZE = 20000000000000;
    const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const avatarSchema = z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
            message: i18n.t('form.errors.fileTooLarge'),
        })
        .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
            message: i18n.t('form.errors.fileTypeInvalid'),
        });

    export const editAvatarFormSchema = z.object({
        avatar: avatarSchema,
    });

    export type EditAvatarForm = z.infer<typeof editAvatarFormSchema>;

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
        waitingForValidationBooks?: BaseUserBook[];
        waitingForValidationComments?: ReviewsToValidate[]
    }

    export type Avatar = {
        url: string;
    }

    export type UserBookFromBack = {
        status: 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned';
        book: {
            id: number;
            title: string;
            type: string;
            cover: {
                filename: string
            };
        }
    }

    export type BaseUserBook<T extends 'toRead' | 'reading' | 'read' | 'wishlist' | 'abandoned' | '' = ''> = {
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
        email: emailSchema,
        reason: z.string().min(1, { message: i18n.t('form.errors.required') }),
    })

    export type ContactUsForm = z.infer<typeof contactUsSchema>;

    export type AdminBook = {
        id: number;
        title: string;
        author: Author;
        type: string;
        subjects: Subject[];
        dateOfPublication: string;
        image: string;
        editions: Edition[];
        summary?: string;
        status: 'waiting' | 'refused' | 'accepted';
    }

    type Author = {
        id: number;
        lastname: string;
        firstname: string;
    };

    type Subject = {
        id: number;
        label: string;
    };

    type Edition = {
        id: number;
        label: string;
        language: string;
        numberOfPages: number;
        dateOfPublication: string;
    };

    export type UpdateBookStatusPayload = {  status: 'refused' | 'accepted', bookId: number, userRole: 'admin' | 'user' | Array<'admin' | 'user'> }
    export type UpdateBookStatusResponse = {  message: string, type: 'success' | 'error' }
    export type SendCommentValidationPayload = {  commentId: number, status: 'refused' | 'accepted' }
    export type SendCommentValidationResponse = {  message: string, type: 'success' | 'error' }

    export type ProfileBookFromBack = {
        id: number;
        title: string;
        status: string;
        cover: {
            id: number;
            filename: string;
        };
    }

    export type ProfileCommentFromBack = {
        user: {
            id: number;
            username: string;
        };
        book: {
            id: number;
            title: string;
        }
        content: string;
        status: string;
    }

    type ReviewsToValidate = {
        id: number;
        userId: number;
        username: string;
        bookId: number;
        bookTitle: string;
        text: string;
        status: string;
    }
}
