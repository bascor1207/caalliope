import { selectActiveUser } from '@/modules/user/core/store/user.selectors';
import { useAppSelector } from '@/modules/store/create-store';
import { CustomCard } from '@/modules/app/ui/component-level/custom.card';
import { useTranslation } from 'react-i18next';

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
