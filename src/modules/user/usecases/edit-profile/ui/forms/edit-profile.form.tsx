import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { UsersModel } from '@/modules/user/core/model/users.model';
import { selectActiveUser, selectEditProfileFormState } from '@/modules/user/core/store/user.selectors';
import { editProfile } from '@/modules/user/core/store/user.slice';

export const EditProfileForm: FC = () => {
    const { t } = useTranslation();
    const activeUser = useAppSelector(selectActiveUser);
    const editProfileFormStatus = useAppSelector(selectEditProfileFormState);
    const dispatch = useDispatch<AppDispatch>();

    const formItems = [
        { id: 'username', name: 'username', label: t('form.username'), type: 'string' },
        { id: 'email', name: 'email', label: t('form.email'), type: 'email' },
        { id: 'password', name: 'password', label: t('form.password'), type: 'password' }
    ] satisfies Array<{ id: string, name: keyof UsersModel.EditProfileForm, label: string, type: string }>;


    return (
        <CustomForm
            items={formItems}
            schema={UsersModel.editProfileFormSchema(activeUser)}
            formType='modal'
            modalTitle={t('account.editing')}
            visibilityTrigger={editProfileFormStatus === 'displayed'}
            onCustomClose={() => { dispatch(editProfile('hidden')) }}
        />
    );
};

export default EditProfileForm;
