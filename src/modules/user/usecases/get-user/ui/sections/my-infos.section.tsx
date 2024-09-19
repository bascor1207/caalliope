import { Button, Image } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/modules/app/core/store/create-store';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { editAvatar, editProfile } from '@/modules/user/core/store/user.slice';



export const MyInfosSection = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);
    const dispatch = useDispatch<AppDispatch>();

    const content = () => {
        return  (
            <div className='p-6  space-y-6'>
                <div className='space-y-4'>
                    <div className='flex items-center'>
                        <span className='font-semibold text-custom-dark-purple w-32'>{t('user.firstName')}:</span>
                        <span className='text-gray-900'>{activeUser.firstName}</span>
                    </div>
                    <div className='flex items-center'>
                        <span className='font-semibold text-custom-dark-purple w-32'>{t('user.lastName')}:</span>
                        <span className='text-gray-900'>{activeUser.lastName}</span>
                    </div>
                    <div className='flex items-center'>
                        <span className='font-semibold text-custom-dark-purple w-32'>{t('user.username')}:</span>
                        <span className='text-gray-900'>{activeUser.username}</span>
                    </div>
                    {activeUser.avatar ? (
                        <div className='flex items-center'>
                            <Button onPress={() => dispatch(editAvatar('displayed'))} className='bg-transparent text-custom-dark-purple font-semibold p-0 mr-4 rounded-md hover:bg-custom-purple transition duration-300'>
                                {t('account.avatar')}
                            </Button>
                            <Image src={`${activeUser.avatar}`} alt={activeUser.username} width={42} height={42} />
                        </div>
                    ): (
                        <Button onPress={() => dispatch(editAvatar('displayed'))} className='bg-transparent text-custom-dark-purple font-semibold py-2 rounded-md hover:bg-custom-purple transition duration-300'>
                            {t('account.addAvatar')}
                        </Button>
                    )}
                </div>

                <div className='pt-4'>
                    <Button
                        onPress={() => { dispatch(editProfile('displayed')) }}
                        className='w-full bg-custom-purple text-custom-dark-purple font-semibold py-2 rounded-md hover:opacity-50 transition duration-300'
                    >
                        {t('account.editing')}
                    </Button>
                </div>
            </div>
        )
    };

    return (
        <CustomCard title={t('account.myInfos')} content={content} className='w-full cursor-default min-h-full bg-white'
                    isPressable={false}/>
    )
}
