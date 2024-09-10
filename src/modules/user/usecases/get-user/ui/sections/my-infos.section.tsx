import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { editProfile } from '@/modules/user/core/store/user.slice';



export const MyInfosSection = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();

    const content = () => {
        return (
            <>
            <div className='text-black'>
                <div>{activeUser.firstName}</div>
                <div>{activeUser.lastName}</div>
                <div>{activeUser.username}</div>
            </div>
                <Button onPress={() => {dispatch(editProfile('displayed'))}} className='w-full'>{t('account.editing')}</Button>
            </>
        )
    };

    return (
        <CustomCard title={t('account.home')} content={content} className='w-full cursor-default min-h-full' isPressable={false} />
    )
}
