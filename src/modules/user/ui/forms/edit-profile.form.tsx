import React from 'react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { UsersModel } from '@/modules/user/model/users.model';

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
    ] satisfies Array<{id: string, name: keyof UsersModel.EditProfileForm, label: string, type: string}>;

    return (
        <CustomForm
            items={formItems}
            schema={UsersModel.editProfileFormSchema}
            formType='plain'
        />
    );
};

export default EditProfileForm;
