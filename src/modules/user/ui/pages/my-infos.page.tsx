import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/modules/app/core/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { selectActiveUser } from '@/modules/user/core/store/user.selectors';


export const MyInfosPage = () => {
    const { t } = useTranslation()
    const activeUser = useAppSelector(selectActiveUser);

    const content = () => {
        return (
            <div className='text-black'>
                <div>{activeUser.firstName}</div>
                <div>{activeUser.lastName}</div>
                <div>{activeUser.username}</div>
            </div>
        )
    };

    return (
        <CustomCard title={t('account.home')} content={content} className='w-full cursor-default min-h-full' isPressable={false} />
    )
}
