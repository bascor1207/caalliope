import { z } from 'zod';
import i18n from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserModel {
    const usernameSchema = z.string().min(1, { message: i18n.t('form.errors.required') });
    const emailSchema = z.string().email({ message: i18n.t('form.errors.invalidEmail') });
    const passwordSchema = z.string().min(8, { message: i18n.t('form.errors.passwordTooShort') });

    export const editProfileFormSchema = z.object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
    });

    // Type TypeScript correspondant au schéma EditProfilForm
    export type EditProfileForm = z.infer<typeof editProfileFormSchema>;
}
