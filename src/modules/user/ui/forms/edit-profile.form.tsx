import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomForm } from '@/modules/ui/component-level/custom.form';
import { UserModel } from '@/modules/user/model/user.model'; // Utilise le même CustomForm que dans EditBookForm

export const EditProfileForm: FC = () => {
    const { t } = useTranslation();

    const formItems = [
        {
            id: 'username',
            name: 'username',
            label: t('form.username'),
            type: 'string',
        },
        {
            id: 'email',
            name: 'email',
            label: t('form.email'),
            type: 'email',
        },
        {
            id: 'password',
            name: 'password',
            label: t('form.password'),
            type: 'password',
        }
    ] satisfies Array<{id: string, name: keyof UserModel.EditProfileForm, label: string, type: string}>;

    return (
        <CustomForm
            items={formItems}
            schema={UserModel.editProfileFormSchema}
        />
    );
};

export default EditProfileForm;
