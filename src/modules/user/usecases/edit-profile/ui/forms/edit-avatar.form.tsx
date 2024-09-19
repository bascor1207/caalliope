import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';
import type { FC } from 'react';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomForm } from '@/modules/app/ui/component-level/custom.form';
import { UsersModel } from '@/modules/user/core/model/users.model';
import { selectEditAvatarFormState } from '@/modules/user/core/store/user.selectors';
import { editAvatar, editProfile } from '@/modules/user/core/store/user.slice';
import { editProfileUsecase } from '@/modules/user/usecases/edit-profile/core/edit-profile.usecase';

export const EditProfileForm: FC = () => {
    const { t } = useTranslation();
    const editAvatarFormStatus = useAppSelector(selectEditAvatarFormState);
    const dispatch = useDispatch<AppDispatch>();

    const formItems = [
        { id: 'file', name: 'avatar', label: t('form.avatar'), type: 'file' },
    ] satisfies Array<{ id: string, name: keyof UsersModel.EditAvatarForm, label: string, type: string }>;


    return (
        <CustomForm
            items={formItems}
            action={editProfileUsecase}
            schema={UsersModel.editAvatarFormSchema}
            formType='modal'
            modalTitle={t('account.editing')}
            visibilityTrigger={editAvatarFormStatus === 'displayed'}
            onCustomClose={() => { dispatch(editAvatar('hidden')) }}
        />
    );
};

export default EditProfileForm;
