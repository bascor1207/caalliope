import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './EditProfil.module.scss';

interface EditProfilFormProps {
    hideModal: () => void;
}

export const EditProfilForm: FC<EditProfilFormProps> = ({ hideModal }) => {
    const { t } = useTranslation();
    const {
        formState: { errors }
    } = useForm();

    const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log('Form data:', formData);
        hideModal();
        // const newEmail = formData.get('email') as string;
        // const newPassword = formData.get('password') as string;
        // const newUsername = formData.get('username') as string;
        // const data: IUserUpdateDatas = {
        //     uid: uid,
        //     username: newUsername ? newUsername : username,
        //     credentials: {
        //         email: newEmail ? newEmail : credentials.email,
        //         password: newPassword ? newPassword : credentials.password
        //     }
        // };
        // dispatch(updateUser(data))
        //     .then((response) => dispatch(setUser(response.payload)))
        //     .then(() => hideModal());
    };

    return (
        <form onSubmit={onSubmit}>
            <div className={styles.container}>
                <span className={styles.title}>{t('account.edit')}</span>
                <div className={styles.username}>
                    <label>{t('form.username')}</label>
                    <input className={styles.input} type='text' name='username' />
                </div>
                <div className={styles.email}>
                    <label>{t('form.email')}</label>
                    <input className={styles.input} type='email' name='email' />
                    {errors.email && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.password}>
                    <label>{t('form.password')}</label>
                    <input className={styles.input} type='password' name='password' />
                    {errors.password && <span>{t('form.required')}</span>}
                </div>
                <div className={styles.buttons}>
                    <button className={styles.submit} type='submit'>
                        {t('valid')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditProfilForm;